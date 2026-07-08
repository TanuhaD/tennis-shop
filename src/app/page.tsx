import Link from "next/link";
import HeroSection from "./components/HeroSection";
import ProductCard from "./components/ProductCard";
import { prismaUser } from "@/lib/prismaUser";
export default async function HomePage() {
	const products = await prismaUser.product.findMany({
		take: 8,
		orderBy: { createdAt: "desc" },
	});
	const mappedProducts = products.map((p) => ({
		id: p.id.toString(),
		name: p.name,
		slug: p.slug,
		description: p.description,
		imageUrl: p.imageUrl,
		price: p.price,
		brand: p.brand ?? null,
		category: p.category ?? null,
		isNew: p.isNew,
		gender: p.gender ?? null,
		sizes: p.sizes ?? null,
		createdAt: p.createdAt,
		updatedAt: p.updatedAt,
	}));

	return (
		<div className="space-y-24">
			{/* HERO */}
			<HeroSection />

			{/* PRODUCTS */}
			<section className="max-w-7xl mx-auto px-6">
				<h2 className="text-3xl font-extrabold mb-10">Популярні товари</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{mappedProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
				<Link
					href="/products"
					className="inline-block mt-10 text-indigo-600 font-semibold hover:underline">
					Переглянути весь каталог →
				</Link>
			</section>
		</div>
	);
}
