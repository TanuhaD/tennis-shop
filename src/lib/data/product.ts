import { ProductFilters, ProductsResult, Gender } from "@/types/product";
import { prismaUser } from "../prismaUser";
import { ProductType } from "@/types/db";
import { Prisma } from "@prisma/client";

// утиліта (тільки для читання з DB -> ProductType)
function parseGender(v: string | null | undefined): Gender | null {
	if (v === "men" || v === "women" || v === "unisex" || v === "children") {
		return v;
	}
	return null;
}

export async function getProductBySlug(
	slug: string,
): Promise<ProductType | null> {
	try {
		const product = await prismaUser.product.findUnique({
			where: { slug },
		});

		if (!product) return null;

		return {
			id: product.id.toString(),
			name: product.name,
			slug: product.slug,
			description: product.description,
			imageUrl: product.imageUrl,
			price: product.price,

			brand: product.brand ?? null,
			category: product.category ?? null,
			isNew: product.isNew,

			gender: parseGender(product.gender ?? null),
			sizes: product.sizes ?? null,

			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
		};
	} catch (error) {
		console.error(`Помилка завантаження продукту ${slug}:`, error);
		return null;
	}
}

/**
 * Завантажує продукти з фільтрами + сорт + пагінація
 */
export async function getAllProducts(
	filters: ProductFilters = {},
): Promise<ProductsResult> {
	const {
		page = 1,
		limit = 12,

		brands = [],
		genders = [],
		sizes = [],

		minPrice,
		maxPrice,
		isNew,
		sort = "newest",
	} = filters;

	const where: Prisma.ProductWhereInput = {};

	// ✅ brands чекбокси
	if (brands.length > 0) {
		where.brand = { in: brands };
	}

	// ✅ genders чекбокси
	if (genders.length > 0) {
		where.gender = { in: genders };
	}

	// ✅ sizes чекбокси (Product.sizes: String[])
	if (sizes.length > 0) {
		where.sizes = { hasSome: sizes };
	}

	if (typeof isNew === "boolean") {
		where.isNew = isNew;
	}

	if (minPrice !== undefined || maxPrice !== undefined) {
		where.price = {};
		if (minPrice !== undefined) where.price.gte = minPrice;
		if (maxPrice !== undefined) where.price.lte = maxPrice;
	}

	const orderBy: Prisma.ProductOrderByWithRelationInput =
		sort === "price_asc"
			? { price: "asc" }
			: sort === "price_desc"
				? { price: "desc" }
				: { createdAt: "desc" };

	const safePage = Number.isFinite(page) && page > 0 ? page : 1;
	const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 12;

	const [products, total] = await Promise.all([
		prismaUser.product.findMany({
			where,
			orderBy,
			skip: (safePage - 1) * safeLimit,
			take: safeLimit,
		}),
		prismaUser.product.count({ where }),
	]);

	return {
		products: products.map((p) => ({
			id: p.id.toString(),
			name: p.name,
			slug: p.slug,
			description: p.description,
			imageUrl: p.imageUrl,
			price: p.price,

			brand: p.brand ?? null,
			category: p.category ?? null,
			isNew: p.isNew,

			gender: parseGender(p.gender ?? null),
			sizes: p.sizes ?? null,

			createdAt: p.createdAt,
			updatedAt: p.updatedAt,
		})),
		total,
		page: safePage,
		totalPages: Math.ceil(total / safeLimit),
	};
}
