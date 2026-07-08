"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import type { ShoppingCart } from "@/types/cart";
import {
	updateCartQuantity,
	removeCartItemAction,
	addProductToCart,
} from "@/app/cart/actions";
import { recalcCart } from "@/lib/cart/recalcCart";
import { toast } from "react-hot-toast";

/* ======================================================
   Types
====================================================== */

interface CartContextType {
	cart: ShoppingCart;
	loading: boolean;
	updateQuantity: (productId: string, quantity: number) => Promise<void>;
	removeItem: (productId: string) => Promise<void>;
	addItem: (productId: string) => Promise<void>;
}

interface Props {
	children: ReactNode;
}

/* ======================================================
   Helpers
====================================================== */

const emptyCart = (): ShoppingCart => ({
	id: "guest",
	userId: null,
	createdAt: new Date(),
	updatedAt: new Date(),
	items: [],
	size: 0,
	subtotal: 0,
});

/* ======================================================
   Context
====================================================== */

const CartContext = createContext<CartContextType | undefined>(undefined);

/* ======================================================
   Provider
====================================================== */

export function CartProvider({ children }: Props) {
	const [cart, setCart] = useState<ShoppingCart>(emptyCart());
	const [loading, setLoading] = useState(true);

	/* --------------------------------------------------
	   1️⃣ INIT — read from localStorage ONCE
	-------------------------------------------------- */
	useEffect(() => {
		try {
			const stored = localStorage.getItem("cart");
			if (stored) {
				setCart(JSON.parse(stored));
			}
		} catch (e) {
			console.warn("Failed to read cart from localStorage", e);
		} finally {
			setLoading(false);
		}
	}, []);

	/* --------------------------------------------------
	   2️⃣ SYNC — write AFTER init only
	-------------------------------------------------- */
	useEffect(() => {
		if (!loading) {
			localStorage.setItem("cart", JSON.stringify(cart));
		}
	}, [cart, loading]);

	/* --------------------------------------------------
	   UPDATE QUANTITY
	-------------------------------------------------- */
	const updateQuantity = async (productId: string, quantity: number) => {
		const snapshot = cart;

		// REMOVE
		if (quantity <= 0) {
			setCart((prev) =>
				recalcCart(
					prev,
					prev.items.filter((i) => i.productId !== productId)
				)
			);

			const result = await removeCartItemAction(productId);

			if (!result.success) {
				setCart(snapshot);
				toast.error(result.error || "Не вдалося видалити товар");
			} else {
				toast.success("Товар видалено");
			}
			return;
		}

		// UPDATE
		setCart((prev) =>
			recalcCart(
				prev,
				prev.items.map((item) =>
					item.productId === productId ? { ...item, quantity } : item
				)
			)
		);

		const result = await updateCartQuantity(productId, quantity);

		if (!result.success) {
			setCart(snapshot);
			toast.error(result.error || "Не вдалося оновити кількість");
		} else {
			toast.success("Кількість оновлено");
		}
	};

	/* --------------------------------------------------
	   REMOVE ITEM
	-------------------------------------------------- */
	const removeItem = async (productId: string) => {
		const snapshot = cart;

		setCart((prev) =>
			recalcCart(
				prev,
				prev.items.filter((i) => i.productId !== productId)
			)
		);

		const result = await removeCartItemAction(productId);

		if (!result.success) {
			setCart(snapshot);
			toast.error(result.error || "Помилка видалення");
		} else {
			toast.success("Товар видалено");
		}
	};

	/* --------------------------------------------------
	   ADD ITEM
	-------------------------------------------------- */
	const addItem = async (productId: string) => {
		const snapshot = cart;

		// optimistic UI
		setCart((prev) => {
			const existing = prev.items.find((i) => i.productId === productId);

			const items = existing
				? prev.items.map((i) =>
						i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
				  )
				: [
						...prev.items,
						{
							id: crypto.randomUUID(),
							cartId: prev.id,
							productId,
							quantity: 1,
							createdAt: new Date(),
							updatedAt: new Date(),
							product: {
								id: productId,
								name: "Завантаження…",
								price: 0,
								imageUrl: "/placeholder.png",
							},
						},
				  ];

			return recalcCart(prev, items);
		});

		const result = await addProductToCart(productId);

		if (!result.success) {
			setCart(snapshot);
			toast.error(result.error);
			return;
		}

		// hydrate real product data
		setCart((prev) =>
			recalcCart(
				prev,
				prev.items.map((item) =>
					item.productId === productId
						? {
								...item,
								id: result.item.id,
								product: result.item.product,
						  }
						: item
				)
			)
		);

		toast.success("Товар додано");
	};

	/* -------------------------------------------------- */

	return (
		<CartContext.Provider
			value={{ cart, loading, updateQuantity, removeItem, addItem }}>
			{children}
		</CartContext.Provider>
	);
}

/* ======================================================
   Hook
====================================================== */

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within CartProvider");
	}
	return context;
}
