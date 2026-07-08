"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserPlus, ArrowLeft, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

/**
 * Сторінка реєстрації нового користувача.
 * Використовує клієнтський функціонал для обробки форми.
 */
const RegisterPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	/**
	 * Обробник відправлення форми реєстрації.
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSuccess(false);

		if (password !== confirmPassword) {
			setError("Паролі не збігаються.");
			return;
		}

		setIsLoading(true);

		try {
			// 1. Надсилаємо запит на API маршрут для реєстрації
			const response = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				// Обробка помилок сервера (наприклад, користувач вже існує)
				// data.message - це повідомлення, яке повертає наш API-маршрут
				throw new Error(data.message || "Помилка реєстрації.");
			}

			// 2. Успішна реєстрація: намагаємося автоматично увійти
			setIsSuccess(true);

			const signInResponse = await signIn("credentials", {
				email,
				password,
				redirect: false, // Не перенаправляємо одразу
				callbackUrl: "/",
			});

			if (signInResponse?.error) {
				// Якщо автовхід не вдався, просимо користувача увійти вручну
				setError("Реєстрація успішна. Будь ласка, увійдіть вручну.");
			} else {
				// Успішний вхід - перенаправляємо на головну
				window.location.href = signInResponse?.url || "/";
			}
		} catch (err: unknown) {
			// ✅ ВИПРАВЛЕНО: Замість 'any' використовуємо 'unknown'
			console.error("Registration error:", err);

			let errorMessage = "Невідома помилка під час реєстрації.";

			// ✅ ДОДАНО: Перевірка типу для безпечного доступу до повідомлення
			if (err instanceof Error) {
				errorMessage = err.message;
			}

			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[70vh] py-12">
			<div className="card w-full max-w-lg bg-base-100 shadow-2xl p-6 md:p-10 border-t-8 border-primary rounded-xl">
				<div className="card-body p-0">
					<h2 className="text-3xl font-bold text-center text-primary mb-2 flex items-center justify-center space-x-2">
						<UserPlus size={28} />
						<span>Створити акаунт</span>
					</h2>
					<p className="text-center text-gray-500 mb-6">
						Швидка реєстрація для оформлення замовлень та доступу до історії.
					</p>

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Поле Email */}
						<div>
							<label className="label">
								<span className="label-text">Електронна пошта</span>
							</label>
							<input
								type="email"
								placeholder="ваш@email.com"
								className="input input-bordered w-full"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						{/* Поле Пароль */}
						<div>
							<label className="label">
								<span className="label-text">Пароль</span>
							</label>
							<input
								type="password"
								placeholder="Мінімум 6 символів"
								className="input input-bordered w-full"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={6}
							/>
						</div>

						{/* Поле Підтвердження пароля */}
						<div>
							<label className="label">
								<span className="label-text">Підтвердіть пароль</span>
							</label>
							<input
								type="password"
								placeholder="Повторіть пароль"
								className="input input-bordered w-full"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								minLength={6}
							/>
						</div>

						{/* Повідомлення про помилку */}
						{error && (
							<div className="alert alert-error shadow-lg mt-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="stroke-current shrink-0 h-6 w-6"
									fill="none"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>{error}</span>
							</div>
						)}

						{/* Повідомлення про успіх */}
						{isSuccess && !error && (
							<div className="alert alert-success shadow-lg mt-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="stroke-current shrink-0 h-6 w-6"
									fill="none"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>Успішна реєстрація! Перенаправлення...</span>
							</div>
						)}

						<div className="card-actions justify-end mt-6">
							<button
								type="submit"
								className="btn btn-primary btn-block text-white"
								disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 size={20} className="animate-spin" />
										Реєстрація...
									</>
								) : (
									<>
										<UserPlus size={20} />
										Зареєструватися
									</>
								)}
							</button>
						</div>
					</form>

					<div className="divider text-sm text-gray-400">Вже є акаунт?</div>

					<div className="text-center">
						<Link href="/api/auth/signin" className="btn btn-ghost btn-sm">
							<ArrowLeft size={16} /> Перейти до входу
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
