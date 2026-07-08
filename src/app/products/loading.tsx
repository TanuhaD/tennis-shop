export default function LoadingProducts() {
	return (
		<div className="max-w-7xl mx-auto px-6 py-12">
			<div className="h-10 w-64 rounded-xl bg-gray-100" />
			<div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
				<div className="hidden lg:block rounded-2xl border p-4">
					<div className="h-6 w-28 rounded bg-gray-100" />
					<div className="mt-4 space-y-2">
						{Array.from({ length: 10 }).map((_, i) => (
							<div key={i} className="h-4 w-full rounded bg-gray-100" />
						))}
					</div>
				</div>

				<div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="rounded-2xl border p-3">
								<div className="aspect-square w-full rounded-xl bg-gray-100" />
								<div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
								<div className="mt-2 h-4 w-1/2 rounded bg-gray-100" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
