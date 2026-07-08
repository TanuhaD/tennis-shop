import { ProductType } from "@/types/db";

export type Gender = "men" | "women" | "unisex" | "children";

export type SortValue = "newest" | "price_asc" | "price_desc";

export interface ProductFilters {
	page?: number;
	limit?: number;

	// ✅ multi checkbox
	brands?: string[];
	genders?: Gender[];
	sizes?: string[];

	minPrice?: number; // ₴ або cents — як у тебе в базі
	maxPrice?: number;

	isNew?: boolean;

	sort?: SortValue;
}

export interface ProductsResult {
	products: ProductType[];
	total: number;
	page: number;
	totalPages: number;
}
