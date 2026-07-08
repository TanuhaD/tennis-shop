"use client";

import React, { useState } from "react";
import PaymentMethod from "../checkout/PaymentMethod";
import { createOrderFromCart } from "@/actions/order";
import { useRouter } from "next/navigation";

import { DollarSign } from "lucide-react";
import toast from "react-hot-toast";

type PaymentType = "cod" | "online";

export default function CheckoutForm() {
	const [paymentMethod, setPaymentMethod] = useState<PaymentType>("cod");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const result = await createOrderFromCart();

			if (!result.success) {
				toast.error(result.error);
				return;
			}

			toast.success("Замовлення успішно створено!");
			router.push(`/orders/${result.orderId}`);
		} catch (error) {
			console.error(error);
			toast.error("Помилка оформлення замовлення");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-10">
			<h1 className="text-4xl font-bold mb-8 text-center text-indigo-600">
				Оформлення замовлення <DollarSign className="inline-block mb-1" />
			</h1>

			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-xl shadow-xl space-y-8">
				{/* 1. Контакти */}
				<section>
					<h2 className="text-2xl font-semibold mb-4">
						1. Контактна інформація
					</h2>

					<div className="grid gap-4">
						<input
							required
							placeholder="Імʼя та прізвище"
							className="input input-bordered w-full"
						/>
						<input
							required
							type="email"
							placeholder="Email"
							className="input input-bordered w-full"
						/>
						<input
							required
							type="tel"
							placeholder="Телефон"
							className="input input-bordered w-full"
						/>
					</div>
				</section>

				{/* 2. Доставка */}
				<section>
					<h2 className="text-2xl font-semibold mb-4">2. Адреса доставки</h2>

					<div className="grid gap-4">
						<input
							required
							placeholder="Місто"
							className="input input-bordered w-full"
						/>
						<input
							required
							placeholder="Вулиця, будинок, квартира"
							className="input input-bordered w-full"
						/>
					</div>
				</section>

				{/* 3. Оплата */}
				<section>
					<h2 className="text-2xl font-semibold mb-4">3. Метод оплати</h2>

					<PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
				</section>

				<button
					type="submit"
					disabled={isSubmitting}
					className="btn btn-primary btn-lg w-full">
					{isSubmitting ? "Оформлення..." : "Підтвердити замовлення"}
				</button>
			</form>
		</div>
	);
}
