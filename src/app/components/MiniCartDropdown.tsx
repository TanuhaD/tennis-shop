"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
interface Props {
	onClose: () => void;
}

export default function MiniCartDropdown({ onClose }: Props) {
	const { cart } = useCart();

	if (cart.items.length === 0) {
		return <div className="p-4 text-sm text-gray-500">Кошик порожній</div>;
	}

	return (
		<div className="w-80 p-4 space-y-3">
			{cart.items.map((item) => (
				<div key={item.productId} className="flex justify-between text-sm">
					<span className="truncate">{item.product.name}</span>
					<span>
						{item.quantity} × ₴{item.product.price}
					</span>
				</div>
			))}

			<div className="border-t pt-2 flex justify-between font-semibold">
				<span>Разом:</span>
				<span>₴{cart.subtotal}</span>
			</div>

			<Link
				href="/cart"
				onClick={onClose}
				className="btn btn-primary btn-sm w-full">
				Перейти до кошика
			</Link>
		</div>
	);
}
