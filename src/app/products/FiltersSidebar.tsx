"use client";

import { useProductFilters } from "./useProductFilters";
import type { Gender } from "../../types/product";

type Options = {
	brands: string[];
	categories: string[];
	genders: string[];
	sizes: string[];
};

export default function FiltersSidebar({ options }: { options: Options }) {
	const f = useProductFilters();

	return (
		<div className="rounded-2xl border p-4 space-y-6">
			<div className="flex items-center justify-between">
				<div className="font-semibold">Filters</div>
				<button
					className="text-sm underline opacity-80"
					onClick={f.resetAll}
					disabled={f.isPending}>
					Reset
				</button>
			</div>

			{/* Sorting */}
			<div className="space-y-2">
				<div className="text-sm font-medium">Sorting</div>
				<select
					className="w-full rounded-lg border p-2"
					value={f.current.sort}
					onChange={(e) => f.onSortChange(e.target.value)}
					disabled={f.isPending}>
					<option value="newest">Newest</option>
					<option value="price_asc">Price ↑</option>
					<option value="price_desc">Price ↓</option>
				</select>
			</div>

			{/* isNew */}
			<label className="flex items-center gap-2">
				<input
					type="checkbox"
					checked={f.current.isNew}
					onChange={(e) => f.setIsNew(e.target.checked)}
					disabled={f.isPending}
				/>
				<span className="text-sm">New arrivals</span>
			</label>

			{/* Brands */}
			<div className="space-y-2">
				<div className="text-sm font-medium">Brand</div>
				<div className="space-y-2">
					{options.brands.map((b) => {
						const checked = f.current.brands.includes(b);
						return (
							<label key={b} className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={checked}
									onChange={() => f.toggleBrand(b)}
									disabled={f.isPending}
								/>
								<span className="text-sm">{b}</span>
							</label>
						);
					})}
				</div>
			</div>

			{/* Gender */}
			<div className="space-y-2">
				<div className="text-sm font-medium">Gender</div>
				<div className="space-y-2">
					{options.genders.map((g) => {
						const gg =
							g === "men" || g === "women" || g === "unisex" || g === "children"
								? (g as Gender)
								: null;

						if (!gg) return null;

						const checked = f.current.genders.includes(gg);

						const label =
							gg === "men"
								? "Men"
								: gg === "women"
									? "Women"
									: gg === "unisex"
										? "Unisex"
										: "Children";

						return (
							<label key={gg} className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={checked}
									onChange={() => f.toggleGender(gg)}
									disabled={f.isPending}
								/>
								<span className="text-sm">{label}</span>
							</label>
						);
					})}
				</div>
			</div>

			{/* Sizes */}
			<div className="space-y-2">
				<div className="text-sm font-medium">Size</div>
				<div className="text-xs opacity-60">
					XS–XL (одяг) • L0–L5 (grip ракетки) • OS (аксесуари)
				</div>
				<div className="grid grid-cols-3 gap-2">
					{options.sizes.map((s) => {
						const checked = f.current.sizes.includes(s);
						return (
							<button
								key={s}
								type="button"
								onClick={() => f.toggleSize(s)}
								disabled={f.isPending}
								className={`rounded-lg border px-2 py-1 text-sm ${
									checked ? "font-semibold" : "opacity-80"
								}`}>
								{s}
							</button>
						);
					})}
				</div>
			</div>

			{/* Price */}
			<div className="space-y-2">
				<div className="text-sm font-medium">Price</div>
				<div className="grid grid-cols-2 gap-2">
					<input
						className="rounded-lg border p-2"
						placeholder="min"
						value={f.minPriceInput}
						onChange={(e) => f.setMinPriceInput(e.target.value)}
					/>
					<input
						className="rounded-lg border p-2"
						placeholder="max"
						value={f.maxPriceInput}
						onChange={(e) => f.setMaxPriceInput(e.target.value)}
					/>
				</div>
				<button
					type="button"
					className="w-full rounded-lg border p-2 text-sm"
					onClick={f.clearPrice}
					disabled={f.isPending}>
					Clear price
				</button>
			</div>
		</div>
	);
}
