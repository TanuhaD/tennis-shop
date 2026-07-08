"use client";

import FiltersSidebar from "./FiltersSidebar";
import ActiveFiltersBar from "./ActiveFiltersBar";
import FiltersDrawer from "./FiltersDrawer";
import ProductGrid from "./ProductGrid";
import Pagination from "../components/Pagination";
import EmptyState from "./EmptyState";
import { ProductFiltersProvider } from "./useProductFilters";
import type { ProductType } from "../../types/db";

type Options = {
	brands: string[];
	categories: string[];
	genders: string[];
	sizes: string[];
};

export default function ProductsClient({
	options,
	products,
	total,
	page,
	totalPages,
	pageSize,
}: {
	options: Options;
	products: ProductType[];
	total: number;
	page: number;
	totalPages: number;
	pageSize: number;
}) {
	return (
		<ProductFiltersProvider>
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
				<aside className="hidden lg:block lg:sticky lg:top-6 h-fit">
					<FiltersSidebar options={options} />
				</aside>

				<section>
					<div className="mb-4 space-y-3">
						<FiltersDrawer options={options} />
						<ActiveFiltersBar />
					</div>

					{total === 0 ? (
						<EmptyState />
					) : (
						<>
							<ProductGrid products={products} />

							<div className="mt-8">
								<Pagination
									page={page}
									totalPages={totalPages}
									total={total}
									pageSize={pageSize}
								/>
							</div>
						</>
					)}
				</section>
			</div>
		</ProductFiltersProvider>
	);
}
