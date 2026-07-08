"use server";

import { prisma } from "@/lib/db/prisma";
import { getCart } from "@/lib/db/cart";
import { auth } from "@/auth/auth";
import { OrderStatus, PaymentStatus } from "@/types/db";

type CreateOrderResult =
	| { success: true; orderId: string }
	| { success: false; error: string };

export async function createOrderFromCart(): Promise<CreateOrderResult> {
	const session = await auth();

	if (!session?.user?.id) {
		return { success: false, error: "Необхідна авторизація" };
	}

	const cart = await getCart();

	if (!cart || cart.items.length === 0) {
		return { success: false, error: "Кошик порожній" };
	}

	try {
		const order = await prisma.$transaction(async (tx) => {
			const createdOrder = await tx.order.create({
				data: {
					userId: session.user.id,
					status: OrderStatus.pending,
					paymentStatus: PaymentStatus.pending,
					total: cart.subtotal,

					items: {
						create: cart.items.map((item) => ({
							productId: item.productId,
							quantity: item.quantity,
							price: item.product.price,
						})),
					},
				},
			});

			await tx.cartItem.deleteMany({
				where: { cartId: cart.id },
			});

			return createdOrder;
		});

		return { success: true, orderId: order.id };
	} catch (error) {
		console.error("CREATE ORDER ERROR:", error);
		return { success: false, error: "Помилка створення замовлення" };
	}
}
