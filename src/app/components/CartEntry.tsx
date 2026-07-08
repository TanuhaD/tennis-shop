"use client";

import React from "react";
import { CartItemWithProduct } from "@/types/cart";
import { formatPrice } from "@/lib/utils/formatPrice";
import CartItemQuantityInput from "./CartItemQuantityInput";
import CartItemRemoveButton from "./CartItemRemoveButton";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

interface CartEntryProps {
	cartItem: CartItemWithProduct;
}

export default function CartEntry({ cartItem }: CartEntryProps) {
	const { updateQuantity, removeItem } = useCart();

	const product = cartItem.product;
	const totalItemPrice = product.price * cartItem.quantity;

	return (
		<div className="flex items-center p-4 bg-white rounded-xl shadow">
			<Link href={`/products/${product.slug}`} className="w-24 h-24 relative">
				<Image
					src={product.imageUrl || "/placeholder.png"}
					alt={product.name}
					fill
					className="object-contain"
				/>
			</Link>

			<div className="flex-grow ml-4">
				<Link href={`/products/${product.slug}`} className="font-bold">
					{product.name}
				</Link>

				<p>{formatPrice(product.price)}</p>
				<p className="font-semibold">{formatPrice(totalItemPrice)}</p>
			</div>

			<CartItemQuantityInput
				productId={product.id}
				initialQuantity={cartItem.quantity}
				updateCartItemQuantity={updateQuantity}
			/>

			<CartItemRemoveButton
				productId={product.id}
				productName={product.name}
				onRemove={removeItem}
			/>
		</div>
	);
}
