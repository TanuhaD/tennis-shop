import { it, expect } from "vitest";
import { recalcCart } from "../../cart/recalcCart";
import type { ShoppingCart, CartItemWithProduct } from "../../../types/cart";

const baseCart: ShoppingCart = {
	id: "test",
	userId: null,
	createdAt: new Date(),
	updatedAt: new Date(),
	items: [],
	size: 0,
	subtotal: 0,
};

it("recalculates cart size and subtotal", () => {
	const items: CartItemWithProduct[] = [
		{
			id: "item-1",
			productId: "prod-1",
			cartId: "test",
			quantity: 2,
			createdAt: new Date(),
			updatedAt: new Date(),
			product: {
				id: "prod-1",
				name: "Test product",
				price: 100,
			},
		},
	];

	const cart = recalcCart(baseCart, items);

	expect(cart.size).toBe(2);
	expect(cart.subtotal).toBe(200);
});
