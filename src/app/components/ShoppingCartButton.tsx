"use client";

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import CartSidebar from "./CartSidebar";

export default function ShoppingCartButton() {
	const { cart } = useCart();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="relative btn btn-ghost btn-circle">
				<ShoppingCart size={24} />
				{cart.size > 0 && (
					<span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
						{cart.size}
					</span>
				)}
			</button>

			<CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</>
	);
}
