"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { type StaticImageData } from "next/image"; // Імпортуємо тип для локального зображення

// Зображення-заглушки (нові робочі посилання з Unsplash)
const heroImages: { url: string | StaticImageData; alt: string }[] = [
	{ url: "/images/tennis_balls.jpg", alt: "Яскраві тенісні м'ячі на корті" },
	{
		url: "/images/tennis_racket.jpg",
		alt: "Професійна тенісна ракетка на корті",
	},
	{
		url: "/images/tennis_shoes.jpg",
		alt: "Тенісні кросівки на поверхні корту",
	},
];

// Запасний фон (placeholder) на випадок помилки завантаження зовнішніх зображень
const fallbackImage =
	"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgODAwIDQ1MCI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiNjY2NjY2MiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSI0MHB4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjNzc3Ij5OZXRleGEgRHVsaWNoYSBQb3NsdWdhaTwvdGV4dD48L3N2Zz4=";

const HeroSection: React.FC = () => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	// Стан для відстеження, чи була помилка завантаження зображень
	const [hasError, setHasError] = useState(false);

	// Логіка циклічної зміни зображень
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prevIndex) =>
				prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
			);
		}, 5000); // Зміна кожні 5 секунд

		return () => clearInterval(interval);
	}, []);

	// Функція для скидання помилки (щоб спробувати завантажити наступне зображення)
	const handleError = () => {
		if (!hasError) {
			console.error(
				"Помилка завантаження одного або кількох зображень Hero Section. Використовується запасний фон."
			);
			setHasError(true);
		}
	};

	return (
		<div className="relative w-full overflow-hidden">
			{/* Контейнер для зображень, що забезпечує необхідну висоту */}
			<div className="relative h-[60vh] md:h-[75vh] lg:h-[85vh]">
				{/* Стек зображень для плавного переходу */}
				{heroImages.map((image, index) => (
					<Image
						key={index}
						// Використовуємо запасне зображення, якщо була помилка
						src={hasError ? fallbackImage : image.url}
						alt={image.alt}
						// Обробка помилок завантаження зовнішніх ресурсів
						onError={handleError}
						// Класи позиціонування
						fill
						priority={index === 0} // Прискорення завантаження першого зображення
						sizes="(max-width: 768px) 100vw, 100vw"
						className={`
                object-cover 
                transition-opacity duration-1000 ease-in-out
                ${index === currentImageIndex ? "opacity-100" : "opacity-0"}
              `}
						style={{
							zIndex: index === currentImageIndex ? 1 : 0,
						}}
					/>
				))}

				{/* Накладання затемненого шару для кращої читабельності тексту */}
				<div className="absolute inset-0 bg-black bg-opacity-30 z-10" />

				{/* Контент (Заголовок та Кнопка) */}
				<div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
					<h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-lg">
						Ваша гра починається тут
					</h1>
					<p className="text-lg sm:text-xl md:text-2xl text-white mb-8 max-w-2xl drop-shadow-md">
						Знайдіть ідеальні ракетки, кросівки та м&apos;ячі для перемоги на
						корті.
					</p>
					<button className="btn btn-lg btn-secondary text-lg shadow-xl hover:shadow-2xl transition duration-300">
						Переглянути колекцію
					</button>
				</div>
			</div>
		</div>
	);
};

export default HeroSection;
