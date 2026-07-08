import { Prisma } from "@prisma/client";
import type { Gender } from "@/types/product";
// ----------------------------------------------------
// 1. Базові Enums
// ----------------------------------------------------
// Визначаємо Enums як 'const' для надійного використання в TypeScript
export const Role = {
	user: "user",
	admin: "admin",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const OrderStatus = {
	pending: "pending",
	paid: "paid",
	shipped: "shipped",
	delivered: "delivered",
	canceled: "canceled",
	processing: "processing",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
	pending: "pending",
	paid: "paid",
	failed: "failed",
	refunded: "refunded",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

// ----------------------------------------------------
// 2. Типи для Product (використовуються для зв'язків)
// ----------------------------------------------------

// Тип продукту з усіма полями (для Server Components)
// export type ProductDbType = Prisma.ProductGetPayload<undefined>;

// ProductType для фронтенду: конвертуємо MongoDB ObjectId у string
// types/db.ts
// ProductType для фронтенду (DTO)
export interface ProductType {
	id: string;
	name: string;
	slug: string;
	description: string;
	imageUrl: string;

	price: number;

	brand?: string | null;
	category?: string | null;

	isNew: boolean;
	isFeatured?: boolean | null;

	// 🔥 для фільтрів
	gender: "men" | "women" | "unisex" | "children" | null;
	sizes: string[] | null;

	createdAt: Date;
	updatedAt: Date;
}

// ----------------------------------------------------
// 3. Типи для Order, Cart та Item (з включеними зв'язками)
// ----------------------------------------------------

// Налаштування для включення повних деталей продукту в CartItem/OrderItem
// ✅ ВИПРАВЛЕНО: Додано префікс '_' для ігнорування ESLint
const _itemWithProductDetails = Prisma.validator<Prisma.CartItemDefaultArgs>()({
	include: {
		product: true, // Включаємо повний об'єкт продукту Prisma
	},
});

// CartItemType - Тип елемента кошика з ProductType
export type CartItemType = Omit<
	Prisma.CartItemGetPayload<typeof _itemWithProductDetails>,
	// Виключаємо поля, які ми перевизначаємо або змінюємо їх тип на фронтенді
	"id" | "productId" | "product" | "cartId" | "orderId" | "price" | "quantity"
> & {
	id: string;
	productId: string;
	product: ProductType;
	cartId: string | null;
	orderId: string | null;
	price: number;
	quantity: number;
};

// Тип для кошика (Cart)
// ✅ ВИПРАВЛЕНО: Префікс "_" сигналізує ESLint, що змінна використовується лише для типу
const _cartWithItemsAndUser = Prisma.validator<Prisma.CartDefaultArgs>()({
	include: {
		items: _itemWithProductDetails,
		user: { select: { id: true, email: true, name: true } },
	},
});

// CartType - Тип кошика з CartItemType
export type CartType = Omit<
	Prisma.CartGetPayload<typeof _cartWithItemsAndUser>, // ✅ Використовуємо _cartWithItemsAndUser
	"items"
> & {
	items: CartItemType[];
};

// Utility для перевизначення статусів Prisma-типів на наші локальні строкові типи
type OmitPrismaEnums<T> = Omit<T, "status" | "paymentStatus" | "items"> & {
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	items: CartItemType[];
};

// Тип для замовлення (Order)
// ✅ ВИПРАВЛЕНО: Префікс "_" сигналізує ESLint, що змінна використовується лише для типу
const _orderWithItemsAndUser = Prisma.validator<Prisma.OrderDefaultArgs>()({
	include: {
		items: _itemWithProductDetails,
		user: { select: { id: true, email: true, name: true } },
	},
});

// OrderType - Тип замовлення з локальними статусами
export type OrderType = OmitPrismaEnums<
	Prisma.OrderGetPayload<typeof _orderWithItemsAndUser> // ✅ Використовуємо _orderWithItemsAndUser
>;

// Тип для User
export type UserType = Pick<
	Prisma.UserGetPayload<undefined>,
	"id" | "name" | "email" | "role" | "image" | "emailVerified"
>;
