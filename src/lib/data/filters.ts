import { prismaUser } from "@/lib/prismaUser";

export async function getFilterOptions() {
	const products = await prismaUser.product.findMany({
		select: {
			brand: true,
			category: true,
			gender: true,
			sizes: true,
		},
	});

	const brands = Array.from(
		new Set(products.map((p) => p.brand).filter(Boolean)),
	) as string[];

	const categories = Array.from(
		new Set(products.map((p) => p.category).filter(Boolean)),
	) as string[];

	const genders = Array.from(
		new Set(products.map((p) => p.gender).filter(Boolean)),
	) as string[];

	const sizes = Array.from(
		new Set(products.flatMap((p) => p.sizes ?? []).filter(Boolean)),
	) as string[];

	brands.sort();
	categories.sort();
	genders.sort();
	sizes.sort();

	return { brands, categories, genders, sizes };
}
