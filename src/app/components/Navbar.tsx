"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ShoppingCart, User, LogIn, LogOut, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import MiniCartDropdown from "../components/MiniCartDropdown";

const Navbar: React.FC = () => {
	// 1. Отримання сесії для стану авторизації
	const { data: session } = useSession();
	const user = session?.user;

	const { cart } = useCart();
	const cartSize = cart.size;

	const [cartOpen, setCartOpen] = useState(false);

	const [searchOpen, setSearchOpen] = useState(false);

	// 3. Меню посилань
	const navLinks = [
		{ name: "Головна", href: "/" },
		{ name: "Продукти", href: "/products" },
		{ name: "Адмін", href: "/admin", adminOnly: true }, // Тільки для адмінів
	];

	return (
		<header className="sticky top-0 z-30 shadow-md bg-base-100/90 backdrop-blur-sm">
			<nav className="navbar max-w-7xl mx-auto px-4 sm:px-6   lg:px-28 flex flex-col justify-center  sm:flex-row">
				{/* Логотип (Початок) */}
				<div className="navbar-center md:navbar-start">
					<Link
						href="/"
						className="btn btn-ghost text-xl font-bold text-primary hover:bg-transparent">
						<span className="text-2xl font-black">TENNIS</span>
						<span className="text-secondary ml-0.5">SHOP</span>
					</Link>
				</div>

				{/* Навігація (Центр) - Відображається лише на великих екранах */}
				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal p-0 font-medium">
						{navLinks.map((link) => {
							// Приховати 'Адмін' посилання, якщо користувач не є адміном (заглушка)
							if (
								link.adminOnly &&
								(!user || user.email !== "admin@example.com")
							) {
								return null;
							}
							return (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-gray-600 hover:text-primary transition-colors">
										{link.name}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>

				{/* Елементи Користувача та Кошик (Кінець) */}
				<div className=" navbar-center md:navbar-end space-x-2">
					{/* Кнопка Кошика */}
					<div className="relative">
						<button
							onClick={() => setCartOpen((v) => !v)}
							className="btn btn-ghost btn-circle relative">
							<ShoppingCart size={24} />
							{cartSize > 0 && (
								<span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
									{cartSize}
								</span>
							)}
						</button>

						<AnimatePresence>
							{cartOpen && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									className="absolute right-0 mt-3 z-50 bg-base-100 rounded-box shadow border"
									onKeyDown={(e) => e.key === "Escape" && setCartOpen(false)}>
									<MiniCartDropdown onClose={() => setCartOpen(false)} />
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Кнопка Уподобань (заглушка) */}
					<button className="btn btn-ghost btn-circle">
						<Heart size={24} className="text-gray-600 hover:text-secondary" />
					</button>

					{/* Меню Користувача або Вхід/Вихід */}
					<div className="dropdown dropdown-end">
						<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
							{/* Відображення аватара або іконки користувача */}
							<div className="w-10 rounded-full bg-gray-200 flex p-2">
								{user ? (
									<span className="text-xl font-semibold text-primary">
										{user.name
											? user.name[0]
											: user.email?.[0] || <User size={24} />}
									</span>
								) : (
									<LogIn size={20} className="text-gray-500" />
								)}
							</div>
						</label>
						<ul
							tabIndex={0}
							className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-gray-200">
							{user ? (
								<>
									<li className="menu-title px-4 py-2 text-sm text-gray-700">
										{user.name || user.email}
									</li>
									<li>
										<Link href="/profile" className="justify-between">
											Профіль
										</Link>
									</li>
									{/* Умовне посилання на Адмінку в меню для зручності */}
									{user.email === "admin@example.com" && (
										<li>
											<Link href="/admin">Панель Адміністратора</Link>
										</li>
									)}
									<li>
										<button onClick={() => signOut()} className="text-red-500">
											<LogOut size={16} /> Вийти
										</button>
									</li>
								</>
							) : (
								<>
									<li>
										<Link
											href="/api/auth/signin?callbackUrl=/"
											className="btn btn-primary btn-sm my-1 text-white">
											<LogIn size={16} /> Увійти
										</Link>
									</li>
									<li>
										<Link href="/register">Зареєструватися</Link>
									</li>
								</>
							)}
						</ul>
					</div>

					{/* Меню-гамбургер для мобільних (показуємо лише на LG екранах) */}
					<div className="dropdown dropdown-end sm:hidden ">
						<div tabIndex={0} className="btn btn-ghost btn-circle">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h7"
								/>
							</svg>
						</div>
						<ul
							tabIndex={0}
							className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-gray-200">
							{navLinks.map((link) => {
								if (
									link.adminOnly &&
									(!user || user.email !== "admin@example.com")
								) {
									return null;
								}
								return (
									<li key={link.name}>
										<Link href={link.href}>{link.name}</Link>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
				<button
					onClick={() => setSearchOpen((v) => !v)}
					className="btn btn-ghost btn-circle">
					🔍
				</button>
			</nav>
			{/* 🔽 ПОШУК ПІД NAVBAR */}
			<AnimatePresence>
				{searchOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25 }}
						onClick={(e) => e.stopPropagation()}
						className="bg-white border-t shadow-inner px-6 py-4">
						<input
							type="text"
							placeholder="Пошук товарів…"
							className="input input-bordered min-w-full shadow-lg"
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};

export default Navbar;
