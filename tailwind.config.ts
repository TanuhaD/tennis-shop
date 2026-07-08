import type { Config } from "tailwindcss";
// Повертаємося до 'import' для задоволення ESLint.
import daisyui from "daisyui";

// 🔹 Створюємо розширений тип для підтримки DaisyUI
interface DaisyUIConfig {
	themes?: string[] | boolean;
	darkTheme?: string;
	base?: boolean;
	styled?: boolean;
	utils?: boolean;
	rtl?: boolean;
	prefix?: string;
	logs?: boolean;
}

interface ExtendedConfig extends Config {
	daisyui?: DaisyUIConfig;
}

// 🔹 Повна типізація з автодоповненням
const config: ExtendedConfig = {
	// ✅ НАЙБІЛЬШ НАДІЙНІ ШЛЯХИ ДЛЯ APP ROUTER
	content: [
		// 1. App Router Pages/Layouts/Templates (src/app)
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		// 2. Components (src/components)
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		// 3. Library files and utils (src/lib, src/providers, etc.)
		"./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {},
	},
	plugins: [daisyui],
	daisyui: {
		themes: ["light", "dark", "cupcake", "emerald", "corporate"],
		darkTheme: "dark",
		base: true,
		styled: true,
		utils: true,
		rtl: false,
		logs: true,
	},
};

export default config;
