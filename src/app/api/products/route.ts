import { prismaAdmin } from "@/lib/prismaAdmin";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * GET /api/products
 * Отримує список усіх товарів з бази даних.
 */
export async function GET() {
	try {
		const products = await prismaAdmin.product.findMany();
		return NextResponse.json(products);
	} catch (err) {
		console.error("GET /api/products error:", err);
		return NextResponse.json(
			{ message: "Помилка при отриманні товарів" },
			{ status: 500 }
		);
	}
}

/**
 * POST /api/products
 * Додає новий товар у базу даних.
 * Очікує тіло запиту з даними нового продукту.
 */
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		// ✅ Додаємо перевірку, чи передано необхідне поле (наприклад, name)
		if (!body.name || !body.price) {
			return NextResponse.json(
				{ message: "Необхідні поля відсутні" },
				{ status: 400 }
			);
		}

		const product = await prismaAdmin.product.create({ data: body });
		return NextResponse.json(product, { status: 201 });
	} catch (err) {
		console.error("POST /api/products error:", err);
		return NextResponse.json(
			{ message: "Помилка при додаванні товару" },
			{ status: 500 }
		);
	}
}
