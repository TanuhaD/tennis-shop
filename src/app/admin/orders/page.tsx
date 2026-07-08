"use client";
import React, { useEffect, useState } from "react";
// ✅ ВИПРАВЛЕНО: Використовуємо OrderType та OrderStatus з нашого уніфікованого файлу
import { OrderType, OrderStatus } from "@/types/db";
import OrderCard from "../../components/OrderCard";
// ❌ ВИДАЛЕНО: Більше не імпортуємо сирий тип Order від Prisma

const OrdersPage = () => {
	// ✅ ВИПРАВЛЕНО: Використовуємо OrderType[] для стану
	const [orders, setOrders] = useState<OrderType[]>([]);

	const fetchOrders = async () => {
		try {
			// ПРИМІТКА: Припускається, що /api/orders повертає повний OrderType[] (з items та user)
			const res = await fetch("/api/orders");
			if (!res.ok) throw new Error("Помилка при отриманні замовлень");
			// ✅ ВИПРАВЛЕНО: Приводимо відповідь до OrderType[]
			const data: OrderType[] = await res.json();
			setOrders(data);
		} catch (error) {
			console.error(error);
		}
	};

	const deleteOrder = async (id: string) => {
		try {
			const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Помилка при видаленні замовлення");
			// Після видалення оновлюємо список
			fetchOrders();
		} catch (error) {
			console.error(error);
		}
	};

	// ✅ ВИПРАВЛЕНО: Використовуємо наш уніфікований тип OrderStatus
	const updateOrderStatus = async (id: string, status: OrderStatus) => {
		try {
			const res = await fetch(`/api/orders/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				// Надсилаємо лише оновлений статус
				body: JSON.stringify({ status }),
			});
			if (!res.ok) throw new Error("Помилка при оновленні замовлення");
			// Після успішного оновлення статусу оновлюємо список
			fetchOrders();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	return (
		<div className="container mx-auto max-w-7xl p-6">
			<h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
				Керування Замовленнями
			</h1>

			{orders.length === 0 ? (
				<div className="text-center p-10 bg-gray-50 rounded-lg shadow-inner">
					<p className="text-lg text-gray-500">Наразі нових замовлень немає.</p>
				</div>
			) : (
				<div className="grid gap-6">
					{orders.map((order) => (
						// Тепер order має тип OrderType, і onUpdateStatus використовує OrderStatus
						<OrderCard
							key={order.id}
							order={order}
							onDelete={deleteOrder}
							onUpdateStatus={updateOrderStatus}
							// Додаємо проп для відображення додаткових елементів адміністратора (наприклад, user ID)
							isAdminView={true}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default OrdersPage;
