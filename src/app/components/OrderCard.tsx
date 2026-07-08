"use client";

import React from "react";
// 1. ✅ ВИПРАВЛЕНО: Імпортуємо розширений тип OrderType та OrderStatus з нашого db.ts
import type { OrderType, OrderStatus } from "@/types/db";
import { Trash2 } from "lucide-react";

// Допоміжний тип для функцій, які можуть бути як синхронними, так і асинхронними
type Callback = void | Promise<void>;

interface OrderCardProps {
	// 2. ✅ ВИПРАВЛЕНО: Використовуємо OrderType, який включає зв'язок 'items'
	order: OrderType;
	// ⭐️ ВИПРАВЛЕНО: Дозволяємо функціям повертати Promise<void> (для async) АБО void (для sync).
	onDelete: (id: string) => Callback;
	// ⭐️ ВИПРАВЛЕНО: Функції, що викликають API, є асинхронними, тому вони мають повертати Promise<void>
	onUpdateStatus?: (id: string, status: OrderStatus) => Promise<void>;
	// ✅ ДОДАНО: Проп для вирішення помилки на Admin сторінці
	isAdminView?: boolean;
}

/**
 * Картка для відображення деталей замовлення.
 * Використовується на сторінках Адміністратора або Історії замовлень користувача.
 */
const OrderCard: React.FC<OrderCardProps> = ({
	order,
	onDelete,
	onUpdateStatus,
	isAdminView = false, // Деструктуризуємо та встановлюємо значення за замовчуванням
}) => {
	// 4. ✅ ВИПРАВЛЕНО: Отримання списку назв продуктів через order.items.
	// Припускаємо, що OrderType включає items, а items включають повний product.
	const productNames = order.items.map((item) => item.product.name).join(", ");
	const totalItems = order.items.length;

	// Хелпер функція для отримання відповідного класу статусу (для візуалізації)
	const getStatusClass = (status: OrderStatus) => {
		switch (status) {
			case "delivered":
				return "badge-success"; // Зелений
			case "shipped":
				return "badge-info"; // Блакитний
			case "paid":
				return "badge-primary"; // Синій
			case "canceled":
				return "badge-error"; // Червоний
			case "pending":
			default:
				return "badge-warning"; // Жовтий
		}
	};

	return (
		<div className="card bg-base-100 shadow-xl border-l-4 border-primary/70 transition-shadow hover:shadow-2xl">
			<div className="card-body p-5">
				<div className="flex justify-between items-start">
					{/* Деталі замовлення */}
					<div className="space-y-1 text-sm">
						<h2 className="card-title text-xl text-primary mb-2">
							Замовлення #
							<span className="font-mono">{order.id.substring(0, 8)}</span>...
						</h2>
						<p className="text-gray-600">
							<strong>Email:</strong> {order.user?.email || "Анонім"}
						</p>
						{/* Додаємо умовне відображення User ID, якщо він існує */}
						{order.user?.id && (
							<p className="text-gray-600">
								<strong>User ID:</strong>{" "}
								<span className="font-mono">
									{order.user.id.substring(0, 8)}
								</span>
								...
							</p>
						)}
						<p className="text-gray-600">
							<strong>Кількість товарів:</strong> {totalItems}
						</p>
					</div>

					{/* Керування та Статус */}
					<div className="flex flex-col gap-3 items-end">
						{/* Відображення поточного статусу */}
						<div
							className={`badge ${getStatusClass(
								order.status
							)} badge-lg font-bold text-white uppercase`}>
							{order.status}
						</div>

						{/* Оновлення статусу (тільки якщо передана функція onUpdateStatus) */}
						{onUpdateStatus && isAdminView && (
							<select
								className="select select-bordered select-sm border-gray-300 shadow-sm w-full max-w-xs"
								value={order.status ?? "pending"}
								onChange={(e) =>
									onUpdateStatus(order.id, e.target.value as OrderStatus)
								}>
								{/* Використовуємо наш Enum з файлу db.ts для опцій */}
								<option value="pending">Очікування</option>
								<option value="paid">Оплачено</option>
								<option value="shipped">Відправлено</option>
								<option value="delivered">Доставлено</option>
								<option value="canceled">Скасовано</option>
							</select>
						)}

						{/* Кнопка видалення (показуємо лише в режимі адміністратора) */}
						{isAdminView && (
							<button
								className="btn btn-error btn-sm text-white mt-2"
								onClick={() => onDelete(order.id)}>
								<Trash2 size={18} /> Видалити
							</button>
						)}
					</div>
				</div>

				{/* Сума та Список продуктів */}
				<div className="mt-3 pt-3 border-t border-gray-100">
					<p className="text-xl text-right text-gray-800 font-extrabold mb-2">
						<strong>Сума:</strong>{" "}
						<span className="text-secondary ml-1">
							${order.total.toFixed(2)}
						</span>
					</p>
					<p className="text-xs text-gray-500 uppercase font-semibold">
						Склад замовлення:
					</p>
					<p className="text-sm text-gray-700 leading-relaxed">
						{productNames || "Немає даних про товари"}
					</p>
				</div>

				{/* Дата */}
				<p className="text-xs text-right text-gray-400 mt-2">
					Створено: {new Date(order.createdAt).toLocaleString()}
				</p>
			</div>
		</div>
	);
};

export default OrderCard;
