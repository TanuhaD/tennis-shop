"use server";

import { revalidatePath } from "next/cache";
import { addToCart, updateCart, removeFromCart } from "@/lib/db/cart";
import type { CartActionResult, AddToCartResult } from "@/types/cart";

/**
 * Server Action для оновлення кількості товару в кошику
 */
export async function updateCartQuantity(
	productId: string,
	quantity: number,
	userId?: string
): Promise<CartActionResult> {
	try {
		await updateCart(productId, quantity, userId);
		revalidatePath("/cart");
		return { success: true };
	} catch (error) {
		console.error("Помилка оновлення кошика:", error);
		return {
			success: false,
			error: "Не вдалося оновити кількість товару. Спробуйте пізніше.",
		};
	}
}

/**
 * Server Action для видалення товару з кошика
 */
export async function removeCartItemAction(
	productId: string,
	userId?: string
): Promise<CartActionResult> {
	try {
		await removeFromCart(productId, userId);
		revalidatePath("/cart");
		return { success: true };
	} catch (error) {
		console.error("Помилка видалення товару:", error);
		return { success: false, error: "Не вдалося видалити товар." };
	}
}

/**
 * Server Action для додавання товару до кошика
 */

export async function addProductToCart(
	productId: string,
	userId?: string
): Promise<AddToCartResult> {
	try {
		// ⬇️ addToCart ПОВИНЕН повертати cartItem + product
		const { cartItem, product } = await addToCart(productId, userId);

		revalidatePath("/cart");

		return {
			success: true,
			item: {
				id: cartItem.id,
				cartId: cartItem.cartId,
				productId: cartItem.productId,
				quantity: cartItem.quantity,
				createdAt: cartItem.createdAt,
				updatedAt: cartItem.updatedAt,
				product,
			},
		};
	} catch (error) {
		console.error("Помилка додавання товару:", error);
		return { success: false, error: "Не вдалося додати товар до кошика." };
	}
}
