import React from "react";
// 1. ✅ ВИПРАВЛЕНО: Імпортуємо Link для внутрішньої навігації
import Link from "next/link";
// Імпортуємо наш уніфікований тип OrderType
// ✅ ВИПРАВЛЕНО: Додано PaymentStatus до імпорту
import {
	OrderType,
	OrderStatus,
	ProductType,
	UserType,
	PaymentStatus,
} from "@/types/db";
import OrderCard from "@/app/components/OrderCard";
import { AlertTriangle, Home, ChevronRight } from "lucide-react";

// ----------------------------------------------------------------------
// 🚨 MOCK DATA: Замінити на реальну логіку завантаження даних користувача та його замовлень
// ----------------------------------------------------------------------

const mockProduct: ProductType = {
	id: "prod_racket_01",
	name: "Ракетка Pro Master",
	price: 249.99,
	category: "Rackets",
	// ❌ ВИПРАВЛЕНО: Додані відсутні обов'язкові поля slug, brand та isNew
	slug: "racket-pro-master",
	brand: "Wilso", // Приклад бренду
	isNew: true, // Приклад стану
	// 2. ✅ ВИПРАВЛЕНО: Видалено 'stock', щоб відповідати ProductType (якщо він не включає це поле)
	description: "Професійна ракетка для атакуючих гравців.",
	imageUrl: "https://placehold.co/600x400/0077b6/ffffff?text=Racket",
	createdAt: new Date(),
	updatedAt: new Date(),
	isFeatured: true,
};

const mockUser: UserType = {
	id: "user_abc_123",
	email: "user@example.com",
	name: "Іван Користувач",
	role: "user",
	image: null,
	emailVerified: new Date(),
};

const mockOrders: OrderType[] = [
	{
		id: "order_001",
		userId: "user_abc_123",
		total: 249.99,
		// ✅ ВИПРАВЛЕНО: Використовуємо строковий літерал, приведений до OrderStatus, щоб усунути помилку типізації Enum/Prisma
		status: "paid" as OrderStatus,
		// ✅ ВИПРАВЛЕНО: Виправлено приведення типу на PaymentStatus
		paymentStatus: "paid" as PaymentStatus,
		phone: null,
		address: "Київ, вул. Шевченка, 5",
		email: "user@example.com",
		name: "Іван",
		comments: null,
		createdAt: new Date(Date.now() - 86400000 * 5), // 5 днів тому
		updatedAt: new Date(),
		user: mockUser,
		items: [
			{
				id: "item_a",
				productId: mockProduct.id,
				price: 249.99,
				quantity: 1,
				orderId: "order_001",
				cartId: null, // ✅ ВИПРАВЛЕНО: Додано cartId: null для відповідності CartItemType
				createdAt: new Date(),
				updatedAt: new Date(),
				product: mockProduct,
			},
		],
	},
	{
		id: "order_002",
		userId: "user_abc_123",
		total: 15.0,
		status: "shipped" as OrderStatus,
		// ✅ ВИПРАВЛЕНО: Виправлено приведення типу на PaymentStatus
		paymentStatus: "paid" as PaymentStatus,
		phone: null,
		address: "Київ, вул. Шевченка, 5",
		email: "user@example.com",
		name: "Іван",
		comments: null,
		createdAt: new Date(Date.now() - 86400000 * 10), // 10 днів тому
		updatedAt: new Date(),
		user: mockUser,
		items: [
			{
				id: "item_b",
				productId: mockProduct.id,
				price: 5.0,
				quantity: 3,
				orderId: "order_002",
				cartId: null, // ✅ ВИПРАВЛЕНО: Додано cartId: null для відповідності CartItemType
				createdAt: new Date(),
				updatedAt: new Date(),
				product: {
					...mockProduct,
					id: "prod_balls_02",
					name: "Тенісні м'ячі (уп.)",
					price: 5.0,
					category: "Balls",
					slug: "tennis-balls-pack", // Додано slug
					brand: "Dunlop", // Додано brand
					isNew: false, // Додано isNew
				},
			},
		],
	},
	{
		id: "order_003",
		userId: "user_abc_123",
		total: 50.0,
		status: "pending" as OrderStatus,
		// ✅ ВИПРАВЛЕНО: Виправлено приведення типу на PaymentStatus
		paymentStatus: "pending" as PaymentStatus,
		phone: null,
		address: "Київ, вул. Шевченка, 5",
		email: "user@example.com",
		name: "Іван",
		comments: "Потрібно підтвердження",
		createdAt: new Date(Date.now() - 86400000 * 2), // 2 дні тому
		updatedAt: new Date(),
		user: mockUser,
		items: [
			{
				id: "item_c",
				productId: mockProduct.id,
				price: 50.0,
				quantity: 1,
				orderId: "order_003",
				cartId: null, // ✅ ВИПРАВЛЕНО: Додано cartId: null для відповідності CartItemType
				createdAt: new Date(),
				updatedAt: new Date(),
				product: {
					...mockProduct,
					id: "prod_shoes_03",
					name: "Тенісні кросівки",
					price: 50.0,
					category: "Shoes",
					slug: "tennis-shoes", // Додано slug
					brand: "Nike", // Додано brand
					isNew: true, // Додано isNew
				},
			},
		],
	},
];
// ----------------------------------------------------------------------

/**
 * Імітація обробника видалення замовлення
 * У реальному житті це вимагатиме Client Component та API-виклику.
 */
const handleDeleteOrder = (id: string) => {
	// ⚠️ Реальна логіка видалення буде тут.
	console.log(`[USER PAGE] Запит на видалення/скасування замовлення ID: ${id}`);
	// Наприклад: await fetch(`/api/orders/${id}`, { method: 'DELETE' })
};

/**
 * Головний компонент сторінки "Мої замовлення" для користувача.
 * Це Server Component.
 */
const UserOrdersPage = async () => {
	// ⚠️ Тут має бути реальний виклик до Prisma для завантаження замовлень
	// const orders = await prisma.order.findMany({ where: { userId: currentUserId }, include: { items: { include: { product: true } }, user: true } });
	const orders = mockOrders;

	// Сортуємо за датою створення (найновіші зверху)
	orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

	return (
		<div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
			{/* Хлібні крихти */}
			<div className="text-sm breadcrumbs mb-6">
				<ul>
					<li>
						{/* 4. ✅ ВИПРАВЛЕНО: Використовуємо Link */}
						<Link href="/" className="hover:text-primary">
							<Home size={16} /> Головна
						</Link>
					</li>
					<li>
						{/* 5. ✅ ВИПРАВЛЕНО: Використовуємо Link */}
						<Link href="/account" className="hover:text-primary">
							Мій акаунт
						</Link>
					</li>
					<li>
						<ChevronRight size={16} /> Мої замовлення
					</li>
				</ul>
			</div>

			<h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 pb-2">
				Мої Замовлення
			</h1>

			{orders.length === 0 ? (
				<div role="alert" className="alert alert-info shadow-lg">
					<AlertTriangle />
					<span>Ви ще не зробили жодного замовлення.</span>
					<div>
						{/* 6. ✅ ВИПРАВЛЕНО: Використовуємо Link */}
						<Link href="/products" className="btn btn-sm btn-primary">
							Перейти до товарів
						</Link>
					</div>
				</div>
			) : (
				<div className="space-y-6">
					{/* Рендеримо OrderCard для кожного замовлення */}
					{orders.map((order) => (
						<OrderCard
							key={order.id}
							order={order}
							// Для користувача пропонуємо лише функцію видалення/скасування
							onDelete={handleDeleteOrder}
							// onUpdateStatus не передаємо, щоб користувач не бачив select
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default UserOrdersPage;
