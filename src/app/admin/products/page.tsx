"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import type { Product } from "@prisma/client";

// Визначаємо тип, який ми створюємо, виключаючи поля, які генеруються БД.
type NewProductData = Omit<Product, "id" | "createdAt" | "updatedAt">;

const ProductsPage = () => {
	const [products, setProducts] = useState<Product[]>([]);

	// Ініціалізація стану: використовуємо "" або false для обов'язкових полів.
	// Якщо ваша Prisma-схема дозволяє null, ці поля будуть string | null.
	// Якщо вона вимагає рядок, вони будуть string.
	const [newProduct, setNewProduct] = useState<NewProductData>({
		name: "",
		description: "",
		imageUrl: "",
		brand: "",
		price: 0,
		slug: "",
		isNew: false,
		category: "",
		isFeatured: false,
	});

	const fetchProducts = async () => {
		try {
			const res = await fetch("/api/products");
			if (!res.ok) throw new Error("Помилка при отриманні товарів");
			const data: Product[] = await res.json();
			setProducts(data);
		} catch (error) {
			console.error(error);
		}
	};

	const addProduct = async () => {
		try {
			// Перевірка на основні обов'язкові поля перед відправкою
			if (
				!newProduct.name ||
				!newProduct.price ||
				newProduct.price <= 0 ||
				!newProduct.imageUrl ||
				!newProduct.slug
			) {
				console.error(
					"Заповніть обов'язкові поля: Назва, Ціна, Зображення, Slug."
				);
				return;
			}

			const res = await fetch("/api/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newProduct),
			});
			if (!res.ok) throw new Error("Помилка при додаванні товару");

			// Скидаємо стан після успішного додавання
			setNewProduct({
				name: "",
				description: "",
				imageUrl: "",
				brand: "",
				price: 0,
				slug: "",
				isNew: false,
				category: "",
				isFeatured: false,
			});
			fetchProducts();
		} catch (error) {
			console.error(error);
		}
	};

	const deleteProduct = async (id: string) => {
		try {
			const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Помилка при видаленні товару");
			fetchProducts();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Товари</h1>

			<div className="mb-4 flex flex-wrap gap-2 items-end bg-base-200 p-4 rounded-lg shadow-inner">
				{/* Назва */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold mb-1">Назва*</label>
					<input
						className="input input-bordered input-sm w-40"
						placeholder="Назва"
						value={newProduct.name}
						onChange={(e) =>
							setNewProduct({ ...newProduct, name: e.target.value })
						}
						required
					/>
				</div>

				{/* Slug (URL-ідентифікатор) */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold mb-1">Slug*</label>
					<input
						className="input input-bordered input-sm w-40"
						placeholder="slug-товару"
						value={newProduct.slug}
						onChange={(e) =>
							setNewProduct({ ...newProduct, slug: e.target.value })
						}
						required
					/>
				</div>

				{/* Опис */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold mb-1">Опис</label>
					<input
						className="input input-bordered input-sm w-40"
						placeholder="Короткий опис"
						// ✅ ВИПРАВЛЕНО: Використовуємо ?? "" на випадок, якщо description є string | null
						value={newProduct.description ?? ""}
						onChange={(e) =>
							setNewProduct({ ...newProduct, description: e.target.value })
						}
					/>
				</div>

				{/* Бренд */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold mb-1">Бренд</label>
					<input
						className="input input-bordered input-sm w-24"
						placeholder="Бренд"
						// ✅ ВИПРАВЛЕНО: Використовуємо ?? "" на випадок, якщо brand є string | null
						value={newProduct.brand ?? ""}
						onChange={(e) =>
							setNewProduct({ ...newProduct, brand: e.target.value })
						}
					/>
				</div>

				{/* Категорія */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold mb-1">Категорія</label>
					<input
						className="input input-bordered input-sm w-24"
						placeholder="Category"
						// ✅ ВИПРАВЛЕНО: Використовуємо ?? "" на випадок, якщо category є string | null
						value={newProduct.category ?? ""}
						onChange={(e) =>
							setNewProduct({ ...newProduct, category: e.target.value })
						}
					/>
				</div>

				{/* Ціна */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold mb-1">Ціна*</label>
					<input
						className="input input-bordered input-sm w-24"
						placeholder="0.00"
						type="number"
						value={newProduct.price}
						onChange={(e) =>
							setNewProduct({
								...newProduct,
								price: parseFloat(e.target.value) || 0,
							})
						}
						required
						min="0.01"
					/>
				</div>

				{/* URL Зображення */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold mb-1">URL Зображення*</label>
					<input
						className="input input-bordered input-sm w-40"
						placeholder="https://..."
						value={newProduct.imageUrl}
						onChange={(e) =>
							setNewProduct({ ...newProduct, imageUrl: e.target.value })
						}
						required
					/>
				</div>

				{/* Is New */}
				<div className="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={newProduct.isNew} // isNew, ймовірно, просто boolean, тому ?? не потрібен
						onChange={(e) =>
							setNewProduct({ ...newProduct, isNew: e.target.checked })
						}
						className="checkbox checkbox-primary checkbox-sm"
						id="isNewCheckbox"
					/>
					<label htmlFor="isNewCheckbox" className="text-xs font-semibold">
						Новинка
					</label>
				</div>

				{/* Is Featured */}
				<div className="flex items-center space-x-2">
					<input
						type="checkbox"
						// ✅ ВИПРАВЛЕНО: Використовуємо ?? false на випадок, якщо isFeatured є boolean | null
						checked={newProduct.isFeatured ?? false}
						onChange={(e) =>
							setNewProduct({ ...newProduct, isFeatured: e.target.checked })
						}
						className="checkbox checkbox-primary checkbox-sm"
						id="isFeaturedCheckbox"
					/>
					<label htmlFor="isFeaturedCheckbox" className="text-xs font-semibold">
						Рекомендовано
					</label>
				</div>

				{/* Кнопка Додати */}
				<button
					className="btn btn-primary btn-sm text-white"
					onClick={addProduct}>
					Додати товар
				</button>
			</div>

			<h2 className="text-xl font-semibold my-4">
				Наявні товари ({products.length})
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						onDelete={deleteProduct}
					/>
				))}
				{products.length === 0 && (
					<p className="text-gray-500">Товари відсутні.</p>
				)}
			</div>
		</div>
	);
};

export default ProductsPage;
