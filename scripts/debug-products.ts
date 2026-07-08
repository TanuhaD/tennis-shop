import { prismaUser } from "../src/lib/prismaUser";

async function main() {
	// 1️⃣ що Prisma бачить через модель Product
	const prismaCount = await prismaUser.product.count();
	console.log("✅ Prisma product.count() =", prismaCount);

	// 2️⃣ список колекцій у Mongo
	const collections = await prismaUser.$runCommandRaw({
		listCollections: 1,
	});
	console.log("📦 Mongo collections =", JSON.stringify(collections, null, 2));

	// 3️⃣ прямий підрахунок документів у 'products'
	const countProducts = await prismaUser.$runCommandRaw({
		count: "products",
		query: {},
	});
	console.log(
		"🟢 Mongo count(products) =",
		JSON.stringify(countProducts, null, 2),
	);

	// 4️⃣ на всяк випадок — чи існує 'Product'
	const countProduct = await prismaUser.$runCommandRaw({
		count: "Product",
		query: {},
	});
	console.log(
		"🔴 Mongo count(Product) =",
		JSON.stringify(countProduct, null, 2),
	);
}

main()
	.catch(console.error)
	.finally(async () => {
		await prismaUser.$disconnect();
	});
