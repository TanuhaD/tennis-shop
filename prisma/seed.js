// @ts-check
import { PrismaClient } from "@prisma/client";
// ✅ ВИПРАВЛЕНО: Використовуємо bcryptjs, оскільки bcrypt може викликати помилки компіляції
// ПЕРЕКОНАЙТЕСЯ, що ви встановили його: npm install bcryptjs
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Функція для генерації URL зображення
/**
 * Генерує URL для placehold.co, явно вказуючи PNG формат.
 * @param {string} text Текст для плейсхолдера.
 * @param {string} bg_color Колір фону.
 * @param {string} fg_color Колір тексту.
 * @returns {string} URL зображення у форматі PNG.
 */
function createProductImageUrl(text, bg_color, fg_color) {
	// Використовуємо явний .png у шляху для обходу обмежень Next.js Image
	return `https://placehold.co/400x400/${bg_color}/${fg_color}.png?text=${encodeURIComponent(
		text
	)}`;
}

/**
 * Генерує URL-безпечний slug з назви продукту.
 * @param {string} name Назва продукту.
 * @returns {string} Slug.
 */
function createSlug(name) {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "") // Видаляє всі символи, крім слів, пробілів та дефісів
		.replace(/[\s_-]+/g, "-") // Замінює пробіли та підкреслення на один дефіс
		.replace(/^-+|-+$/g, ""); // Видаляє дефіси на початку та в кінці
}

async function main() {
	console.log("Старт seed...");

	// 1. Створення товарів
	const rawProducts = [
		{
			name: "Wilson Racket",
			description:
				"Професійна тенісна ракетка Wilson, ідеальна для досвідчених гравців.",
			price: 15999, // 159.99 USD/UAH
			category: "Equipment",
			imageUrl: createProductImageUrl("Wilson Racket", "0A9396", "ffffff"),
			brand: "Wilson",
		},
		{
			name: "Dunlop Balls (Pack of 4)",
			description: "Набір тенісних м'ячів Dunlop, офіційні м'ячі турніру.",
			price: 2499, // 24.99 USD/UAH
			category: "Accessories",
			imageUrl: createProductImageUrl("Dunlop Balls", "94D2BD", "000000"),
			brand: "Dunlop",
		},
		{
			name: "Nike Court Dri-FIT Shirt",
			description: "Легка спортивна футболка Nike з технологією Dri-FIT.",
			price: 4999, // 49.99 USD/UAH
			category: "Apparel",
			imageUrl: createProductImageUrl("Nike Shirt", "40916C", "ffffff"),
			brand: "Nike",
			isNew: false,
		},
		{
			name: "Adidas Training Shorts",
			description: "Комфортні шорти для тренувань Adidas.",
			price: 3550, // 35.50 USD/UAH
			category: "Apparel",
			imageUrl: createProductImageUrl("Adidas Shorts", "AE2012", "ffffff"),
			brand: "Adidas",
			isFeatured: true,
		},
		{
			name: "Head Tour 6-Racket Bag",
			description: "Спортивна сумка Head для 6 ракеток.",
			price: 8900, // 89.00 USD/UAH
			category: "Accessories",
			imageUrl: createProductImageUrl("Head Bag", "BB3E03", "ffffff"),
			brand: "Head",
			isNew: false,
		},
	];

	// ✅ ВИПРАВЛЕНО: Додаємо SLUG до кожного продукту перед створенням
	const productsWithSlug = rawProducts.map((p) => ({
		...p,
		slug: createSlug(p.name),
	}));

	// Видалення старих товарів та додавання нових
	await prisma.product.deleteMany();
	for (const product of productsWithSlug) {
		await prisma.product.create({ data: product });
	}
	console.log("Товари додані ✅");

	// 2. Створення адміністратора (якщо не існує)
	const existingAdmin = await prisma.user.findUnique({
		where: { email: "admin@store.com" },
	});

	if (!existingAdmin) {
		const password = "adminpassword"; // Використовуйте надійний пароль у реальному застосунку
		const hashedPassword = await bcrypt.hash(password, 10);

		// Зверніть увагу: ми використовуємо bcrypt.hash, який вимагає встановленого пакета (bcryptjs)

		await prisma.user.create({
			data: {
				email: "admin@store.com",
				password: hashedPassword,
				name: "Admin User",
				// ✅ ВИПРАВЛЕНО: Роль вказується як рядок, оскільки Prisma автоматично конвертує його в Enum
				role: "admin",
			},
		});
		console.log("Адміністратор створений ✅");
	} else {
		console.log("Адміністратор вже існує ✅");
	}

	console.log("Seed завершено ✅");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
