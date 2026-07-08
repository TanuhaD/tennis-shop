"use client";

import { useState } from "react";
import FiltersSidebar from "./FiltersSidebar";
import { useProductFilters } from "./useProductFilters";
type Options = {
	brands: string[];
	categories: string[];
	genders: string[];
	sizes: string[];
};
export default function FiltersDrawer({ options }: { options: Options }) {
	const [open, setOpen] = useState(false);
	const f = useProductFilters();

	return (
		<>
			{/* Mobile / Tablet controls */}
			<div className="flex items-center gap-2 lg:hidden">
				<button
					type="button"
					className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
					onClick={() => setOpen(true)}>
					Filters
				</button>

				<button
					type="button"
					className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
					onClick={f.resetAll}
					disabled={f.isPending}>
					Reset
				</button>
			</div>

			{open && (
				<div className="fixed inset-0 z-50">
					<button
						className="absolute inset-0 bg-black/30"
						onClick={() => setOpen(false)}
						aria-label="Close filters"
					/>

					<div className="absolute right-0 top-0 h-full w-[92%] max-w-[380px] bg-white shadow-xl flex flex-col">
						<div className="p-4 border-b flex items-center justify-between">
							<div className="font-bold">Filters</div>
							<button
								type="button"
								className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
								onClick={() => setOpen(false)}>
								Close
							</button>
						</div>

						<div className="p-4 overflow-auto flex-1">
							<FiltersSidebar options={options} />
						</div>

						<div className="p-4 border-t flex gap-2">
							<button
								type="button"
								className="flex-1 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
								onClick={f.resetAll}
								disabled={f.isPending}>
								Reset
							</button>

							<button
								type="button"
								className="flex-1 rounded-lg bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-black/90"
								onClick={() => setOpen(false)}
								disabled={f.isPending}>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
