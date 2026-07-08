import Link from "next/link";

export default function EmptyState() {
	return (
		<div className="rounded-2xl border p-8 text-center">
			<h2 className="text-xl font-semibold">Нічого не знайдено</h2>
			<p className="mt-2 text-sm opacity-70">
				За обраними фільтрами немає товарів. Спробуй змінити фільтри або скинути
				їх.
			</p>

			<div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
				<Link
					href="/products"
					className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
					Reset filters
				</Link>

				<Link
					href="/products?sort=newest"
					className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
					Show newest
				</Link>
			</div>
		</div>
	);
}
