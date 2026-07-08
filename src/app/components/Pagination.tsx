"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface PaginationProps {
	page: number;
	totalPages: number;
	total: number;
	pageSize: number;
	windowSize?: number;
}

type Item = { type: "page"; value: number } | { type: "dots"; key: string };

function buildItems(
	page: number,
	totalPages: number,
	windowSize: number,
): Item[] {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => ({
			type: "page",
			value: i + 1,
		}));
	}

	const items: Item[] = [];
	const clamp = (n: number) => Math.max(1, Math.min(totalPages, n));
	const start = clamp(page - windowSize);
	const end = clamp(page + windowSize);

	const pushPage = (p: number) => items.push({ type: "page", value: p });

	pushPage(1);

	if (start > 2) items.push({ type: "dots", key: "left" });

	for (let p = Math.max(2, start); p <= Math.min(totalPages - 1, end); p++) {
		pushPage(p);
	}

	if (end < totalPages - 1) items.push({ type: "dots", key: "right" });

	pushPage(totalPages);

	return items;
}

function rangeText(page: number, pageSize: number, total: number) {
	if (total === 0) return "Showing 0 results";
	const start = (page - 1) * pageSize + 1;
	const end = Math.min(page * pageSize, total);
	return `Showing ${start}–${end} of ${total}`;
}

export default function Pagination({
	page,
	totalPages,
	total,
	pageSize,
	windowSize = 2,
}: PaginationProps) {
	const sp = useSearchParams();
	const pathname = usePathname();
	const baseParams = useMemo(() => new URLSearchParams(sp.toString()), [sp]);

	const makeHref = (pageNumber: number) => {
		const p = Math.max(1, Math.min(totalPages, pageNumber));
		const next = new URLSearchParams(baseParams.toString());
		next.set("page", String(p));
		return `${pathname}?${next.toString()}`;
	};

	if (totalPages <= 1) {
		return (
			<div className="mt-6 text-sm opacity-70">
				{rangeText(page, pageSize, total)}
			</div>
		);
	}

	const items = buildItems(page, totalPages, windowSize);
	const canPrev = page > 1;
	const canNext = page < totalPages;

	const btnBase = "px-4 py-2 border rounded-md text-sm";
	const btnActive = "bg-black text-white";
	const btnIdle = "bg-white text-gray-700 hover:bg-gray-100";
	const btnDisabled = "opacity-40 pointer-events-none";

	return (
		<div className="mt-8 space-y-3">
			<div className="flex items-center justify-between gap-3 flex-wrap">
				<div className="text-sm opacity-70">
					{rangeText(page, pageSize, total)}
				</div>
				<div className="text-sm opacity-70">
					Page {page} of {totalPages}
				</div>
			</div>

			<nav
				className="flex justify-center gap-2 flex-wrap"
				aria-label="Pagination">
				<Link
					href={makeHref(page - 1)}
					scroll={false}
					className={`${btnBase} ${btnIdle} ${!canPrev ? btnDisabled : ""}`}
					aria-disabled={!canPrev}>
					Prev
				</Link>

				{items.map((it) => {
					if (it.type === "dots") {
						return (
							<span key={it.key} className="px-2 py-2 text-sm opacity-60">
								…
							</span>
						);
					}
					const isActive = it.value === page;
					return (
						<Link
							key={it.value}
							href={makeHref(it.value)}
							scroll={false}
							aria-current={isActive ? "page" : undefined}
							className={`${btnBase} ${isActive ? btnActive : btnIdle}`}>
							{it.value}
						</Link>
					);
				})}

				<Link
					href={makeHref(page + 1)}
					scroll={false}
					className={`${btnBase} ${btnIdle} ${!canNext ? btnDisabled : ""}`}
					aria-disabled={!canNext}>
					Next
				</Link>
			</nav>
		</div>
	);
}
