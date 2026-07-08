"use server";

import { prismaUser as prisma } from "@/lib/prismaUser";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ShoppingCart } from "@/types/cart";

// Ключ cookie для гостьового кошика
const CART_COOKIE_NAME = "localCartId";

/**
 * Отримати кошик користувача (або гостя)
 */
export async function getCart(userId?: string): Promise<ShoppingCart | null> {
	const cartId = (await cookies()).get(CART_COOKIE_NAME)?.value;

	let cart = null;

	if (userId) {
		// Аутентифікований користувач
		cart = await prisma.cart.findFirst({
			where: { userId },
			include: {
				items: { include: { product: true } },
				user: { select: { id: true, name: true, email: true } },
			},
			orderBy: { createdAt: "desc" },
		});

		// Об'єднання гостьового кошика, якщо він існує
		if (cartId) {
			await mergeCart(userId, cartId);
			cart = await prisma.cart.findFirst({
				where: { userId },
				include: {
					items: { include: { product: true } },
					user: { select: { id: true, name: true, email: true } },
				},
			});
		}
	} else if (cartId) {
		// Гостьовий кошик
		cart = await prisma.cart.findUnique({
			where: { id: cartId },
			include: {
				items: { include: { product: true } },
				user: { select: { id: true, name: true, email: true } },
			},
		});
	}

	if (!cart) return null;

	// Обчислюємо size та subtotal
	const size = cart.items.reduce((sum, item) => sum + item.quantity, 0);
	const subtotal = cart.items.reduce(
		(sum, item) => sum + item.quantity * (item.product?.price || 0),
		0
	);

	return { ...cart, size, subtotal } as ShoppingCart;
}

/**
 * Створити новий кошик
 */
export async function createCart(userId?: string): Promise<ShoppingCart> {
	const newCart = await prisma.cart.create({
		data: { userId },
		include: {
			items: { include: { product: true } },
			user: { select: { id: true, name: true, email: true } },
		},
	});

	if (!userId) {
		await (
			await cookies()
		).set(CART_COOKIE_NAME, newCart.id, {
			path: "/",
			maxAge: 60 * 60 * 24 * 30,
		});
	}

	return { ...newCart, size: 0, subtotal: 0 } as ShoppingCart;
}

/**
 * Безпечне об'єднання гостьового кошика з кошиком користувача
 */
async function mergeCart(userId: string, guestCartId: string): Promise<void> {
	const guestCart = await prisma.cart.findUnique({
		where: { id: guestCartId },
		include: { items: true },
	});
	if (!guestCart) return;

	let userCart = await prisma.cart.findFirst({
		where: { userId },
		include: { items: true },
	});
	if (!userCart) userCart = await createCart(userId);

	await prisma.$transaction(async (tx) => {
		for (const guestItem of guestCart.items) {
			const existingItem = userCart!.items.find(
				(i) => i.productId === guestItem.productId
			);

			if (existingItem) {
				await tx.cartItem.update({
					where: { id: existingItem.id },
					data: { quantity: existingItem.quantity + guestItem.quantity },
				});
			} else {
				await tx.cartItem.update({
					where: { id: guestItem.id },
					data: { cartId: userCart!.id },
				});
			}
		}

		await tx.cart.delete({ where: { id: guestCartId } });
	});

	await (await cookies()).set(CART_COOKIE_NAME, "", { maxAge: 0 });
	revalidatePath("/cart");
}

/**
 * Додати товар до кошика (або збільшити кількість)
 */
export async function addToCart(productId: string, userId?: string) {
	let cart = await getCart(userId);
	if (!cart) cart = await createCart(userId);

	const existing = cart.items.find((i) => i.productId === productId);

	let cartItem;

	if (existing) {
		cartItem = await prisma.cartItem.update({
			where: { id: existing.id },
			data: { quantity: existing.quantity + 1 },
		});
	} else {
		cartItem = await prisma.cartItem.create({
			data: {
				cartId: cart.id,
				productId,
				quantity: 1,
			},
		});
	}

	const product = await prisma.product.findUniqueOrThrow({
		where: { id: productId },
	});

	return { cartItem, product };
}

/**
 * Оновити кількість товару в кошику
 */
export async function updateCart(
	productId: string,
	quantity: number,
	userId?: string
) {
	const cart = await getCart(userId);
	if (!cart) throw new Error("Кошик не знайдено.");

	const item = cart.items.find((i) => i.productId === productId);
	if (!item) throw new Error("Товар не знайдено в кошику.");

	if (quantity < 1) return removeFromCart(productId, userId);

	await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
	revalidatePath("/cart");
}

/**
 * Видалити товар з кошика
 */
export async function removeFromCart(productId: string, userId?: string) {
	const cart = await getCart(userId);
	if (!cart) return;

	const item = cart.items.find((i) => i.productId === productId);
	if (!item) return;

	await prisma.cartItem.delete({ where: { id: item.id } });
	revalidatePath("/cart");
}
