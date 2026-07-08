"use client";

import React from "react";
import { useCart } from "../../context/CartContext";
import { X } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import type { CartItemWithProduct } from "../../types/cart";
export default function CartSidebar({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const { cart, updateQuantity, removeItem } = useCart();

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ x: "100%" }}
					animate={{ x: 0 }}
					exit={{ x: "100%" }}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
					className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50 overflow-y-auto p-6 border-l border-gray-200">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold">Ваш кошик</h2>
						<button
							onClick={onClose}
							className="p-1 text-gray-600 hover:text-gray-800">
							<X size={24} />
						</button>
					</div>

					{cart.items.length === 0 ? (
						<div className="text-gray-600">Ваш кошик порожній 😢</div>
					) : (
						<div className="space-y-4">
							{cart.items.map((item: CartItemWithProduct) => (
								<div
									key={item.id}
									className="flex items-center justify-between border-b pb-2">
									<div>
										<div className="font-semibold">{item.product.name}</div>
										<div className="text-sm text-gray-600">
											{(
												(item.product.price * item.quantity) /
												100
											).toLocaleString("uk-UA", {
												style: "currency",
												currency: "USD",
											})}
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<input
											type="number"
											min={1}
											value={item.quantity}
											className="w-16 border rounded p-1 text-center"
											onChange={(e) => {
												const value = Math.max(1, Number(e.target.value) || 1);
												updateQuantity(item.productId, value);
											}}
										/>
										<button
											onClick={() => removeItem(item.productId)}
											className="p-1 text-red-600 hover:text-red-800">
											<X size={20} />
										</button>
									</div>
								</div>
							))}
						</div>
					)}

					{cart.items.length > 0 && (
						<div className="mt-4 border-t pt-4">
							<div className="flex justify-between font-semibold text-gray-800">
								<span>Проміжна сума:</span>
								<span>
									{(cart.subtotal / 100).toLocaleString("uk-UA", {
										style: "currency",
										currency: "USD",
									})}
								</span>
							</div>
							<button className="mt-3 w-full btn btn-primary text-white">
								Оформити замовлення
							</button>
						</div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
