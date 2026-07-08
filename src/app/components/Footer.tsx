import React from "react";
// Видалено: import Link from "next/link";
import {
	Mail,
	Phone,
	MapPin,
	// ВИПРАВЛЕНО: Використовуємо стандартні імпорти Lucide, які мають працювати.
	// Якщо Facebook та Instagram все ще викликають попередження, це може бути специфікою середовища.
	// Ми також імпортуємо X замість Twitter.
	Facebook,
	Instagram,
	X, // Нова назва для іконки Twitter
} from "lucide-react";

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();

	const footerLinks = [
		{
			title: "Продукція",
			links: [
				{ name: "Ракетки", href: "/category/rackets" },
				{ name: "М'ячі", href: "/category/balls" },
				{ name: "Кросівки", href: "/category/shoes" },
				{ name: "Одяг", href: "/category/apparel" },
			],
		},
		{
			title: "Компанія",
			links: [
				{ name: "Про нас", href: "/about" },
				{ name: "Контакти", href: "/contact" },
				{ name: "Вакансії", href: "/careers" },
				{ name: "Блог", href: "/blog" },
			],
		},
		{
			title: "Підтримка",
			links: [
				{ name: "FAQ", href: "/faq" },
				{ name: "Доставка та оплата", href: "/shipping" },
				{ name: "Повернення", href: "/returns" },
				{ name: "Політика конфіденційності", href: "/privacy" },
			],
		},
	];

	return (
		<footer className="bg-gray-800 text-white mt-12 border-t-4 border-sky-500">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				{/* Основна сітка посилань і контактів */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
					{/* 1. Навігаційні посилання */}
					{footerLinks.map((section, index) => (
						<div key={index} className="space-y-3">
							<h3 className="text-lg font-bold text-sky-400 border-b-2 border-sky-400 pb-1 mb-2">
								{section.title}
							</h3>
							<ul className="space-y-2 text-sm">
								{section.links.map((link) => (
									<li key={link.name}>
										{/* ВИПРАВЛЕНО: Замінено Link на <a> для сумісності */}
										<a
											href={link.href}
											className="hover:text-sky-300 transition-colors duration-200">
											{link.name}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}

					{/* 4. Контакти та Соцмережі */}
					<div className="col-span-2 md:col-span-1 space-y-4">
						<h3 className="text-lg font-bold text-sky-400 border-b-2 border-sky-400 pb-1 mb-2">
							{/* ВИПРАВЛЕНО: Змінено апостроф на HTML-сутності, щоб уникнути помилки ESLint */}
							Зв&apos;яжіться з нами
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex items-center space-x-2">
								<Mail size={18} className="text-sky-400" />
								<span>info@tennisshop.ua</span>
							</div>
							<div className="flex items-center space-x-2">
								<Phone size={18} className="text-sky-400" />
								<span>+38 (044) 123 45 67</span>
							</div>
							<div className="flex items-start space-x-2">
								<MapPin size={18} className="text-sky-400 flex-shrink-0 mt-1" />
								<span>
									Київ, вул. Спортивна, 1
									<br />
									Україна, 01001
								</span>
							</div>
						</div>

						{/* Соцмережі */}
						<div className="flex space-x-4 pt-2">
							<a
								href="#"
								aria-label="Facebook"
								className="text-gray-400 hover:text-sky-400 transition-colors">
								<Facebook size={24} />
							</a>
							<a
								href="#"
								aria-label="Instagram"
								className="text-gray-400 hover:text-sky-400 transition-colors">
								<Instagram size={24} />
							</a>
							<a
								href="#"
								aria-label="X (Twitter)"
								className="text-gray-400 hover:text-sky-400 transition-colors">
								{/* ВИПРАВЛЕНО: Використовуємо X замість Twitter */}
								<X size={24} />
							</a>
						</div>
					</div>
				</div>

				{/* Авторське право */}
				<div className="pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
					&copy; {currentYear} Tennis Shop. Усі права захищені.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
