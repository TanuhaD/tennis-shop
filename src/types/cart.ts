// src/types/cart.ts

export type CartItemWithProduct = {
	id: string;
	cartId: string;
	productId: string;
	quantity: number;
	createdAt: Date;
	updatedAt: Date;
	product: {
		id: string;
		name: string;
		price: number;
		imageUrl?: string | null;
		slug?: string;
		description?: string;
		brand?: string | null;
		category?: string | null;
		isNew?: boolean;
		isFeatured?: boolean | null;
	};
};

export type ShoppingCart = {
	id: string;
	userId: string | null;
	createdAt: Date;
	updatedAt: Date;
	items: CartItemWithProduct[];
	size: number;
	subtotal: number;
};
export type CartActionResult =
	| { success: true }
	| { success: false; error: string };
export type AddToCartResult =
	| { success: true; item: CartItemWithProduct }
	| { success: false; error: string };
