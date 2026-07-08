import { getAllProducts } from "../../lib/data/product";
import ProductsClient from "./ProductsClient";
import { redirect } from "next/navigation";
import type { Gender, SortValue } from "../../types/product";
import { getFilterOptions } from "../../lib/data/filters";

export const metadata = {
	title: "Каталог товарів | Tennis Shop",
	description: "Професійний тенісний одяг та аксесуари",
};

type SearchParams = {
	page?: string;

	brand?: string | string[];
	gender?: string | string[];
	size?: string | string[];

	minPrice?: string;
	maxPrice?: string;

	isNew?: string; // "1" | "true" | "false"
	sort?: string;
};

interface ProductsPageProps {
	searchParams: Promise<SearchParams>;
}

const PAGE_SIZE = 6;

function toArray(v: string | string[] | undefined): string[] {
	if (!v) return [];
	return Array.isArray(v) ? v : [v];
}

function parseGender(v: string): Gender | null {
	if (v === "men" || v === "women" || v === "unisex" || v === "children")
		return v;
	return null;
}

function parseSort(v: string | undefined): SortValue {
	if (v === "newest" || v === "price_asc" || v === "price_desc") return v;
	return "newest";
}

function parseIsNew(v: string | undefined): boolean | undefined {
	if (v === undefined) return undefined;
	if (v === "1" || v === "true") return true;
	if (v === "0" || v === "false") return false;
	return undefined;
}

// ✅ зберігаємо мульти-поля при редіректі
function buildQS(params: SearchParams): URLSearchParams {
	const qs = new URLSearchParams();

	// page не ставимо тут навмисно — поставимо пізніше
	for (const b of toArray(params.brand)) qs.append("brand", b);
	for (const g of toArray(params.gender)) qs.append("gender", g);
	for (const s of toArray(params.size)) qs.append("size", s);

	if (params.minPrice) qs.set("minPrice", params.minPrice);
	if (params.maxPrice) qs.set("maxPrice", params.maxPrice);

	if (params.isNew) qs.set("isNew", params.isNew);
	if (params.sort) qs.set("sort", params.sort);

	return qs;
}

export default async function ProductsPage({
	searchParams,
}: ProductsPageProps) {
	const params = await searchParams; // ✅ Next.js 15
	const filterOptions = await getFilterOptions();
	const requestedPage = params.page ? Math.max(1, Number(params.page) || 1) : 1;

	const brands = toArray(params.brand);

	const genders = toArray(params.gender)
		.map(parseGender)
		.filter((x): x is Gender => Boolean(x));

	const sizes = toArray(params.size);

	function parseMoneyToCents(v: string | undefined): number | undefined {
		if (!v) return undefined;

		// дозволяємо "160", "160.5", "160,50"
		const normalized = v.replace(",", ".").trim();
		const n = Number(normalized);

		if (!Number.isFinite(n)) return undefined;

		// 160 -> 16000
		return Math.round(n * 100);
	}

	const minPrice = parseMoneyToCents(params.minPrice);
	const maxPrice = parseMoneyToCents(params.maxPrice);

	const isNew = parseIsNew(params.isNew);
	const sort = parseSort(params.sort);

	const data = await getAllProducts({
		page: requestedPage,
		limit: PAGE_SIZE,
		brands,
		genders,
		sizes,
		isNew,
		minPrice,
		maxPrice,
		sort,
	});

	// ✅ якщо сторінка вилетіла за межі після фільтра
	const maxValidPage = data.totalPages > 0 ? data.totalPages : 1;

	if (requestedPage > maxValidPage) {
		const qs = buildQS(params);

		if (maxValidPage === 1) {
			// чистий URL без page
			const query = qs.toString();
			redirect(query ? `/products?${query}` : "/products");
		} else {
			qs.set("page", String(maxValidPage));
			redirect(`/products?${qs.toString()}`);
		}
	}

	return (
		<div className="max-w-7xl mx-auto px-6 py-12">
			<h1 className="text-4xl font-extrabold mb-10">Каталог товарів</h1>

			<ProductsClient
				options={filterOptions}
				products={data.products}
				total={data.total}
				page={data.page}
				totalPages={data.totalPages}
				pageSize={PAGE_SIZE}
			/>
		</div>
	);
}
