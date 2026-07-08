"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, RefreshCw, Trash2, Tag } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Product } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import { ProductType } from "@/types/db";

const PLACEHOLDER_IMAGE =
	"https://placehold.co/600x750/f3f4f6/6b7280.png?text=No+Image";

export interface ProductCardProps {
	product: ProductType | Product;
	onDelete?: (id: string) => void;
}

const formatPrice = (priceInCents: number): string => {
	const v = priceInCents / 100;
	return v
		.toLocaleString("uk-UA", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
		.replace("$", " $");
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
	const [isAdding, setIsAdding] = useState(false);
	const [imgError, setImgError] = useState(false);
	const { addItem } = useCart();

	const hasExternalImage = !!(product as ProductType).imageUrl;
	const imageUrl = useMemo(() => {
		if (imgError) return PLACEHOLDER_IMAGE;
		return product.imageUrl || PLACEHOLDER_IMAGE;
	}, [imgError, product.imageUrl]);

	const isUsingPlaceholder = !hasExternalImage || imgError;

	const handleAddToCart = async () => {
		setIsAdding(true);
		try {
			await addItem(product.id);
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
			{/* IMAGE */}
			<div className="relative h-[220px] sm:h-[240px]  bg-gray-50">
				<Link
					href={`/products/${product.slug}`}
					aria-label={`Перейти до сторінки товару ${product.name}`}
					className="block h-full w-full">
					<Image
						src={imageUrl}
						alt={product.name}
						fill
						className="object-contain p-3 sm:p-4 transition-transform duration-300 group-hover:scale-[1.03]"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						unoptimized={isUsingPlaceholder}
						onError={() => setImgError(true)}
					/>
				</Link>

				{/* BADGE */}
				{product.isNew && (
					<div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/80 text-white text-xs px-3 py-1">
						<Tag size={12} /> Новинка
					</div>
				)}

				{/* LIKE */}
				<button
					className="absolute top-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 backdrop-blur border border-gray-200 shadow-sm hover:bg-white"
					aria-label="Додати до уподобань"
					onClick={() => toast("Уподобання ще не реалізовано", { icon: "💖" })}>
					<Heart size={18} />
				</button>
			</div>

			{/* BODY */}
			<div className="p-4 flex flex-col flex-1">
				<Link
					href={`/products/${product.slug}`}
					className="hover:text-indigo-600 transition-colors">
					<h2 className="text-base sm:text-lg font-extrabold leading-snug text-gray-900 line-clamp-2 min-h-[44px]">
						{product.name}
					</h2>
				</Link>

				<p className="mt-2 text-sm text-gray-600 line-clamp-2 min-h-[40px]">
					{product.description}
				</p>

				{/* PRICE + BRAND */}
				<div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
					<div className="flex flex-col">
						<span className="text-xs text-gray-500">Ціна</span>
						<span className="text-lg font-black text-indigo-600">
							{formatPrice(product.price)}
						</span>
					</div>

					{product.brand && (
						<span className="text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
							{product.brand}
						</span>
					)}
				</div>

				{/* ACTIONS */}
				<div className="mt-4 flex items-center gap-2">
					<button
						className={`btn btn-primary flex-1 text-white bg-indigo-600 hover:bg-indigo-700 transition-colors ${
							isAdding ? "btn-disabled" : ""
						}`}
						onClick={handleAddToCart}
						disabled={isAdding || !!onDelete}>
						{isAdding ? (
							<>
								<RefreshCw size={18} className="animate-spin" />
								Додаю...
							</>
						) : (
							<>
								<ShoppingCart size={18} />
								До кошика
							</>
						)}
					</button>

					{onDelete && (
						<button
							className="btn btn-outline btn-error btn-square"
							onClick={() => onDelete(product.id)}
							aria-label="Видалити товар">
							<Trash2 size={18} />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
