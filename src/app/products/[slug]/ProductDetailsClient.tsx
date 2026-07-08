"use client";
// Клієнтський компонент з лічильником кількості та кнопкою "Додати до кошика".
import React, { useState } from "react";
import Image from "next/image";
import { ProductType } from "@/types/db";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductDetailsClientProps {
	product: ProductType;
}

/**
 * Відображає деталі продукту та керує додаванням до кошика.
 * Це Client Component.
 */
const ProductDetailsClient: React.FC<ProductDetailsClientProps> = ({
	product,
}) => {
	// 💡 Тут буде логіка useState для додавання до кошика
	const [quantity, setQuantity] = useState(1);

	// 💡 Функція для додавання до кошика

	const { addItem } = useCart();

	const handleAddToCart = async () => {
		for (let i = 0; i < quantity; i++) {
			await addItem(product.id); // ❗ ВАЖЛИВО — id, НЕ slug
		}
	};

	return (
		<div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-xl shadow-lg">
			{/* 1. Зображення продукту */}
			<div className="w-full lg:w-1/2 relative min-h-[400px] rounded-lg overflow-hidden border">
				<Image
					src={
						product.imageUrl ||
						"https://placehold.co/600x600/f0f0f0/333?text=No+Image"
					}
					alt={product.name}
					fill
					sizes="(max-width: 1024px) 100vw, 50vw"
					className="object-cover"
					priority
					onError={(e) => {
						e.currentTarget.src =
							"https://placehold.co/600x600/f0f0f0/333?text=Image+Load+Error";
					}}
				/>
			</div>

			{/* 2. Деталі та керування */}
			<div className="w-full lg:w-1/2 space-y-6">
				<div className="space-y-2">
					<h2 className="text-4xl font-extrabold text-gray-900">
						{product.name}
					</h2>
					<p className="text-xl font-semibold text-sky-600">
						${product.price.toFixed(2)}
					</p>
					<div className="flex space-x-3 text-sm text-gray-500">
						<span className="badge badge-outline">Бренд: {product.brand}</span>
						<span className="badge badge-outline">
							Категорія: {product.category}
						</span>
						{product.isNew && (
							<span className="badge badge-primary">Новинка</span>
						)}
					</div>
				</div>

				<div className="divider">Опис</div>

				<p className="text-gray-700 leading-relaxed">{product.description}</p>

				{/* Керування кількістю та кнопка */}
				<div className="flex items-center space-x-4 pt-4">
					<div className="flex items-center border border-gray-300 rounded-lg">
						<button
							className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
							onClick={() => setQuantity((q) => Math.max(1, q - 1))}
							disabled={quantity <= 1}>
							<Minus size={20} />
						</button>
						<span className="p-3 text-lg font-medium w-12 text-center select-none">
							{quantity}
						</span>
						<button
							className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-lg"
							onClick={() => setQuantity((q) => q + 1)}>
							<Plus size={20} />
						</button>
					</div>

					<button
						className="btn btn-primary btn-lg flex-grow hover:scale-[1.02] transition-transform"
						onClick={handleAddToCart}>
						<ShoppingCart size={20} />
						Додати до кошика
					</button>
				</div>

				<p className="text-sm text-gray-500 pt-4">
					* Функціонал додавання до кошика буде повністю реалізований після
					створення контексту кошика.
				</p>
			</div>
		</div>
	);
};

export default ProductDetailsClient;
