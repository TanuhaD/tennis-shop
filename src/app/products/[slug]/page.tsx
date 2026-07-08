import React from "react";
import { getProductBySlug } from "@/lib/data/product";
import ProductDetailsClient from "./ProductDetailsClient"; // НОВИЙ Client Component для інтерактивності
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface ProductPageProps {
	params: { slug: string }; // id тут - це SLUG продукту
}

// Функція генерації метаданих для SEO
export async function generateMetadata({
	params,
}: ProductPageProps): Promise<Metadata> {
	const product = await getProductBySlug(params.slug);

	if (!product) {
		return {
			title: "Продукт не знайдено",
		};
	}

	return {
		title: product.name,
		description: product.description.substring(0, 150),
		openGraph: {
			images: [product.imageUrl],
		},
	};
}

// ----------------------------------------------------
// Server Component (Отримання даних)
// ----------------------------------------------------
export default async function ProductPage({ params }: ProductPageProps) {
	const product = await getProductBySlug(params.slug);

	if (!product) {
		// Next.js функція для відображення сторінки 404
		notFound();
	}

	return (
		<div className="max-w-6xl mx-auto px-4 py-10">
			<h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
				Деталі продукту: {product.name}
			</h1>

			{/* Передаємо дані продукту клієнтському компоненту */}
			<ProductDetailsClient product={product} />
		</div>
	);
}
