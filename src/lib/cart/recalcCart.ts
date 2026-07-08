import { CartItemWithProduct, ShoppingCart } from "../../types/cart";

// lib/cart/recalcCart.ts
export function recalcCart(
	base: ShoppingCart,
	items: CartItemWithProduct[]
): ShoppingCart {
	return {
		...base,
		items,
		size: items.reduce((a, i) => a + i.quantity, 0),
		subtotal: items.reduce((a, i) => a + i.quantity * i.product.price, 0),
	};
}
