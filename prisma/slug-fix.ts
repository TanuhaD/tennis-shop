import slugify from "slugify";
import { prismaUser } from "@/lib/prismaUser";
function parseGender(
	g: string | null | undefined,
): "men" | "women" | "unisex" | null {
	if (g === "men" || g === "women" || g === "unisex") return g;
	return null;
}

async function fixSlugs() {
	const products = await prismaUser.product.findMany();

	for (const product of products) {
		// генеруємо базовий slug
		const baseSlug = product.name
			? slugify(product.name, { lower: true, strict: true })
			: `product-${product.id}`;

		let slug = baseSlug;
		let counter = 1;

		// перевірка на дублікати
		while (
			await prismaUser.product.findFirst({
				where: { slug, id: { not: product.id } },
			})
		) {
			slug = `${baseSlug}-${counter}`;
			counter++;
		}

		// оновлюємо slug, якщо треба
		if (product.slug !== slug) {
			await prismaUser.product.update({
				where: { id: product.id },
				data: { slug },
			});
			console.log(`✅ Updated slug for "${product.name}" → ${slug}`);
		}

		// оновлюємо gender, щоб не було помилок типу
		const gender = parseGender(product.gender ?? null);
		if (product.gender !== gender) {
			await prismaUser.product.update({
				where: { id: product.id },
				data: { gender },
			});
			console.log(`🎯 Updated gender for "${product.name}" → ${gender}`);
		}
	}

	console.log("🎯 All slugs and genders fixed!");
}

fixSlugs()
	.catch(console.error)
	.finally(() => process.exit());
