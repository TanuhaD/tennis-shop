"use client";

import { X } from "lucide-react";
import { useProductFilters } from "./useProductFilters";
import type { Gender, SortValue } from "../../types/product";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
	return (
		<button
			type="button"
			onClick={onRemove}
			className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-gray-50">
			<span className="truncate max-w-[240px]">{label}</span>
			<X size={14} />
		</button>
	);
}

function sortLabel(v: SortValue) {
	if (v === "newest") return "Newest";
	if (v === "price_asc") return "Price ↑";
	return "Price ↓";
}

export default function ActiveFiltersBar() {
	const f = useProductFilters();

	const { brands, genders, sizes, isNew, sort } = f.current;
	const min = f.current.minPrice;
	const max = f.current.maxPrice;

	const hasPrice = Boolean(min || max);

	const hasAny =
		brands.length > 0 ||
		genders.length > 0 ||
		sizes.length > 0 ||
		hasPrice ||
		isNew ||
		sort !== "newest";

	if (!hasAny) return null;

	return (
		<div className="flex flex-wrap items-center gap-2">
			{brands.map((b) => (
				<Chip
					key={`b-${b}`}
					label={`Brand: ${b}`}
					onRemove={() => f.removeBrand(b)}
				/>
			))}

			{genders.map((g: Gender) => (
				<Chip
					key={`g-${g}`}
					label={`Gender: ${g}`}
					onRemove={() => f.removeGender(g)}
				/>
			))}

			{sizes.map((s) => (
				<Chip
					key={`s-${s}`}
					label={`Size: ${s}`}
					onRemove={() => f.removeSize(s)}
				/>
			))}

			{hasPrice && (
				<Chip
					label={`Price: ${min || "0"}–${max || "∞"}`}
					onRemove={f.clearPrice}
				/>
			)}

			{isNew && <Chip label="New: Yes" onRemove={() => f.setIsNew(false)} />}

			{sort !== "newest" && (
				<Chip
					label={`Sort: ${sortLabel(sort)}`}
					onRemove={() => f.setSort("newest")}
				/>
			)}

			<button
				type="button"
				onClick={f.resetAll}
				className="ml-1 rounded-full border px-3 py-1 text-sm font-semibold hover:bg-gray-50"
				disabled={f.isPending}>
				Clear all
			</button>
		</div>
	);
}
