"use client";

import { ShoppingCart as ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/utils/formatPrice";
import CartEntry from "../components/CartEntry";
import CartItemSkeleton from "../components/CartItemSkeleton";

import { ShoppingCart } from "@/types/cart"; // тип

interface Props {
	initialCart: ShoppingCart | null;
}

export default function CartClient({ initialCart }: Props) {
	const { cart, loading } = useCart();

	if (loading || !cart) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-10 space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<CartItemSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
				<ShoppingCartIcon size={32} className="mr-3 text-indigo-600" />
				Ваш кошик
			</h1>

			{cart.items.length > 0 ? (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-4">
						{cart.items.map((cartItem) => (
							<CartEntry cartItem={cartItem} key={cartItem.id} />
						))}
					</div>

					<div className="lg:col-span-1">
						<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
							<h2 className="text-2xl font-bold mb-4 border-b pb-3 text-gray-900">
								Підсумок замовлення
							</h2>

							<div className="space-y-3">
								<div className="flex justify-between text-lg font-medium text-gray-700">
									<span>Кількість товарів:</span>
									<span className="text-gray-900 font-bold">{cart.size}</span>
								</div>

								<div className="flex justify-between text-lg font-medium text-gray-700">
									<span>Проміжна сума:</span>
									<span className="text-gray-900 font-bold">
										{formatPrice(cart.subtotal)}
									</span>
								</div>

								<div className="flex justify-between text-2xl font-extrabold pt-4 border-t border-gray-200">
									<span>Всього до сплати:</span>
									<span className="text-indigo-600">
										{formatPrice(cart.subtotal)}
									</span>
								</div>
							</div>

							<button
								className="btn btn-primary btn-lg w-full mt-6 text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
								disabled={cart.size === 0}>
								Оформити замовлення
							</button>
						</div>
					</div>
				</div>
			) : (
				<div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-100">
					<ShoppingCartIcon size={64} className="mx-auto text-gray-400 mb-4" />
					<p className="text-xl font-semibold text-gray-700 mb-4">
						Ваш кошик порожній.
					</p>
					<Link
						href="/products"
						className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
						Перейти до покупок
					</Link>
				</div>
			)}
		</div>
	);
}
