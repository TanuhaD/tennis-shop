"use client";

import { ProductType } from "../../types/db";
import ProductCard from "../components/ProductCard";
import { useProductFilters } from "./useProductFilters";

interface Props {
	products: ProductType[];
}

function ProductGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="rounded-2xl border p-3 animate-pulse">
					<div className="aspect-square w-full rounded-xl bg-gray-100" />
					<div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
					<div className="mt-2 h-4 w-1/2 rounded bg-gray-100" />
				</div>
			))}
		</div>
	);
}

export default function ProductGrid({ products }: Props) {
	const f = useProductFilters();

	if (f.isPending) return <ProductGridSkeleton count={products?.length || 6} />;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
