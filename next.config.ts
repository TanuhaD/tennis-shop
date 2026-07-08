import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Додаємо конфігурацію для завантаження зовнішніх зображень
	images: {
		// next/image повинен мати дозвіл на завантаження з цих доменів
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			// === ДОДАНО: ДОЗВІЛ ДЛЯ ЗАГЛУШОК PLACEHOLD.CO ===
			{
				protocol: "https",
				hostname: "placehold.co",
			},
			// === КІНЕЦЬ ДОДАНОГО ===
		],
	},
	/* config options here */
};

export default nextConfig;
