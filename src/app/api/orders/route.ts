import { prismaAdmin } from "@/lib/prismaAdmin";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET /api/orders → всі замовлення
export async function GET() {
	try {
		const orders = await prismaAdmin.order.findMany();
		return NextResponse.json(orders);
	} catch (err) {
		console.error("GET /api/orders error:", err);
		return NextResponse.json(
			{ message: "Помилка при отриманні замовлень" },
			{ status: 500 }
		);
	}
}

// POST /api/orders → створити замовлення
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const order = await prismaAdmin.order.create({ data: body });
		return NextResponse.json(order);
	} catch (err) {
		console.error("POST /api/orders error:", err);
		return NextResponse.json(
			{ message: "Помилка при створенні замовлення" },
			{ status: 500 }
		);
	}
}
