import { prismaAdmin } from "@/lib/prismaAdmin";
import { NextRequest, NextResponse } from "next/server";

// ----------------------------------------------------
// GET /api/orders/:id → отримати конкретне замовлення
// ----------------------------------------------------
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const order = await prismaAdmin.order.findUnique({
			where: { id },
		});

		if (!order) {
			return NextResponse.json(
				{ message: "Замовлення не знайдено" },
				{ status: 404 },
			);
		}

		return NextResponse.json(order);
	} catch (err) {
		console.error("GET /api/orders/[id] error:", err);
		return NextResponse.json(
			{ message: "Помилка при отриманні замовлення" },
			{ status: 500 },
		);
	}
}

// ----------------------------------------------------
// PUT /api/orders/:id → оновити статус замовлення
// ----------------------------------------------------
export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const { status } = await req.json();

		const updatedOrder = await prismaAdmin.order.update({
			where: { id },
			data: { status },
		});

		return NextResponse.json(updatedOrder);
	} catch (err) {
		console.error("PUT /api/orders/[id] error:", err);
		return NextResponse.json(
			{ message: "Помилка при оновленні замовлення" },
			{ status: 500 },
		);
	}
}

// ----------------------------------------------------
// DELETE /api/orders/:id → видалити замовлення
// ----------------------------------------------------
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		await prismaAdmin.order.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Замовлення видалено" });
	} catch (err) {
		console.error("DELETE /api/orders/[id] error:", err);
		return NextResponse.json(
			{ message: "Помилка при видаленні замовлення" },
			{ status: 500 },
		);
	}
}
