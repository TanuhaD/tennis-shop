"use client";

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Gender, SortValue } from "../../types/product";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

type CurrentFilters = {
	brands: string[];
	genders: Gender[];
	sizes: string[];

	isNew: boolean;

	minPrice: string;
	maxPrice: string;

	sort: SortValue;
	page: number;
};

type ProductFiltersContextValue = {
	isPending: boolean;
	current: CurrentFilters;

	// price UI
	minPriceInput: string;
	maxPriceInput: string;
	setMinPriceInput: (v: string) => void;
	setMaxPriceInput: (v: string) => void;
	clearPrice: () => void;

	// paging
	setPage: (page: number) => void;

	// filters
	toggleBrand: (b: string) => void;
	toggleGender: (g: Gender) => void;
	toggleSize: (s: string) => void;
	setIsNew: (v: boolean) => void;
	setSort: (s: SortValue) => void;
	onSortChange: (v: string) => void;
	resetAll: () => void;

	// chips
	removeBrand: (b: string) => void;
	removeGender: (g: Gender) => void;
	removeSize: (s: string) => void;
};

const Ctx = createContext<ProductFiltersContextValue | null>(null);

// ✅ підтримує і URLSearchParams, і ReadonlyURLSearchParams
function getAll(sp: URLSearchParams, key: string) {
	return sp.getAll(key).filter(Boolean);
}

function setMulti(sp: URLSearchParams, key: string, values: string[]) {
	sp.delete(key);
	values.forEach((v) => sp.append(key, v));
}

function setSingle(sp: URLSearchParams, key: string, value?: string) {
	if (!value) sp.delete(key);
	else sp.set(key, value);
}

function toggleInArray(arr: string[], value: string) {
	return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

function parseGender(v: string): Gender | null {
	if (v === "men" || v === "women" || v === "unisex" || v === "children")
		return v;
	return null;
}

function parseSort(v: string | null): SortValue {
	if (v === "newest" || v === "price_asc" || v === "price_desc") return v;
	return "newest";
}

function parsePage(v: string | null): number {
	const n = Number(v ?? "1");
	return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

function normalizePriceInput(v: string) {
	let s = v.replace(/[^\d.,]/g, "");
	s = s.replace(",", ".");

	const parts = s.split(".");
	if (parts.length > 2) s = `${parts[0]}.${parts.slice(1).join("")}`;

	if (s.startsWith(".")) s = `0${s}`;
	s = s.replace(/^0+(?=\d)/, "");

	return s;
}

function isSortValue(v: string): v is SortValue {
	return v === "newest" || v === "price_asc" || v === "price_desc";
}

/* -----------------------------
   Provider
----------------------------- */

export function ProductFiltersProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const sp = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const replaceUrl = useCallback(
		(draft: URLSearchParams) => {
			const qs = draft.toString();
			const next = qs ? `${pathname}?${qs}` : pathname;
			const currentUrl = `${pathname}${sp.toString() ? `?${sp.toString()}` : ""}`;
			if (next === currentUrl) return;

			startTransition(() => {
				router.replace(next, { scroll: false });
			});
		},
		[router, pathname, sp, startTransition],
	);

	const push = useCallback(
		(mutate: (draft: URLSearchParams) => void) => {
			const draft = new URLSearchParams(sp.toString());
			mutate(draft);
			replaceUrl(draft);
		},
		[sp, replaceUrl],
	);

	// ✅ current = тільки дані з URL (без функцій)
	const current: CurrentFilters = useMemo(() => {
		const brands = getAll(new URLSearchParams(sp.toString()), "brand");

		const genders = getAll(new URLSearchParams(sp.toString()), "gender")
			.map(parseGender)
			.filter((g): g is Gender => Boolean(g));

		const sizes = getAll(new URLSearchParams(sp.toString()), "size");

		const isNew = sp.get("isNew") === "1" || sp.get("isNew") === "true";

		const minPrice = sp.get("minPrice") ?? "";
		const maxPrice = sp.get("maxPrice") ?? "";

		const sort = parseSort(sp.get("sort"));
		const page = parsePage(sp.get("page"));

		return { brands, genders, sizes, isNew, minPrice, maxPrice, sort, page };
	}, [sp]);

	// local price inputs (тільки UI)
	const [minPriceInput, _setMinPriceInput] = useState(current.minPrice);
	const [maxPriceInput, _setMaxPriceInput] = useState(current.maxPrice);

	// якщо URL змінився ззовні — синхронізуємо інпути
	useEffect(() => {
		_setMinPriceInput(current.minPrice);
		_setMaxPriceInput(current.maxPrice);
	}, [current.minPrice, current.maxPrice]);

	const setMinPriceInput = (v: string) =>
		_setMinPriceInput(normalizePriceInput(v));
	const setMaxPriceInput = (v: string) =>
		_setMaxPriceInput(normalizePriceInput(v));

	// ✅ debounce auto-apply (без кнопки Apply)
	const debouncedMin = useDebouncedValue(minPriceInput, 450);
	const debouncedMax = useDebouncedValue(maxPriceInput, 450);

	useEffect(() => {
		const min = normalizePriceInput(debouncedMin);
		const max = normalizePriceInput(debouncedMax);

		// якщо те саме, що вже в URL — не пушимо
		if (
			(min || "") === (current.minPrice || "") &&
			(max || "") === (current.maxPrice || "")
		) {
			return;
		}

		push((draft) => {
			setSingle(draft, "minPrice", min || undefined);
			setSingle(draft, "maxPrice", max || undefined);
			setSingle(draft, "page", "1");
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedMin, debouncedMax]);

	// ----------------------------
	// Chips helpers
	// ----------------------------

	const removeOne = (key: "brand" | "gender" | "size", value: string) => {
		push((draft) => {
			const next = getAll(draft, key).filter((v) => v !== value);
			setMulti(draft, key, next);
			setSingle(draft, "page", "1");
		});
	};

	const removeBrand = (b: string) => removeOne("brand", b);
	const removeGender = (g: Gender) => removeOne("gender", g);
	const removeSize = (s: string) => removeOne("size", s);

	const clearPrice = () => {
		_setMinPriceInput("");
		_setMaxPriceInput("");

		push((draft) => {
			setSingle(draft, "minPrice", undefined);
			setSingle(draft, "maxPrice", undefined);
			setSingle(draft, "page", "1");
		});
	};

	// ----------------------------
	// Setters
	// ----------------------------

	const setPage = (page: number) => {
		push((draft) => {
			setSingle(draft, "page", String(Math.max(1, Math.floor(page))));
		});
	};

	const toggleBrand = (brand: string) => {
		push((draft) => {
			const next = toggleInArray(getAll(draft, "brand"), brand);
			setMulti(draft, "brand", next);
			setSingle(draft, "page", "1");
		});
	};

	const toggleGender = (gender: Gender) => {
		push((draft) => {
			const next = toggleInArray(getAll(draft, "gender"), gender);
			setMulti(draft, "gender", next);
			setSingle(draft, "page", "1");
		});
	};

	const toggleSize = (size: string) => {
		push((draft) => {
			const next = toggleInArray(getAll(draft, "size"), size);
			setMulti(draft, "size", next);
			setSingle(draft, "page", "1");
		});
	};

	const setIsNew = (value: boolean) => {
		push((draft) => {
			setSingle(draft, "isNew", value ? "1" : undefined);
			setSingle(draft, "page", "1");
		});
	};

	const setSort = (sort: SortValue) => {
		push((draft) => {
			setSingle(draft, "sort", sort);
			setSingle(draft, "page", "1");
		});
	};

	const onSortChange = (value: string) => {
		if (isSortValue(value)) setSort(value);
	};

	const resetAll = () => {
		startTransition(() => {
			router.replace(pathname, { scroll: false });
		});
	};

	const value: ProductFiltersContextValue = {
		isPending,
		current,

		minPriceInput,
		maxPriceInput,
		setMinPriceInput,
		setMaxPriceInput,
		clearPrice,

		setPage,

		toggleBrand,
		toggleGender,
		toggleSize,
		setIsNew,
		setSort,
		onSortChange,
		resetAll,

		removeBrand,
		removeGender,
		removeSize,
	};

	return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProductFilters() {
	const v = useContext(Ctx);
	if (!v)
		throw new Error(
			"useProductFilters must be used within ProductFiltersProvider",
		);
	return v;
}
