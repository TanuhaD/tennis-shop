import { Prisma } from "@prisma/client";

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
export type ProductDbType = Prisma.ProductGetPayload<undefined>;

// ProductType для фронтенду: конвертуємо MongoDB ObjectId у string
export interface ProductType extends Omit<ProductDbType, "id"> {
	id: string; // Забезпечуємо string для id
}

// ----------------------------------------------------
// 3. Типи для Order, Cart та Item (з включеними зв'язками)
// ----------------------------------------------------

// Налаштування для включення повних деталей продукту в CartItem/OrderItem
export const itemWithProductDetails =
	Prisma.validator<Prisma.CartItemDefaultArgs>()({
		include: {
			product: true, // Включаємо повний об'єкт продукту Prisma
		},
	});

// Новий тип: CartItem, отриманий від Prisma з включеним продуктом. Використовується як вхідний тип у utils.ts
export type PrismaItemWithProduct = Prisma.CartItemGetPayload<
	typeof itemWithProductDetails
>;

// Тип для замовлення (Order) з включеними items та user
export const orderWithItemsAndUser =
	Prisma.validator<Prisma.OrderDefaultArgs>()({
		include: {
			items: itemWithProductDetails,
			user: { select: { id: true, email: true, name: true } },
		},
	});

// Новий тип: Order, отриманий від Prisma з включеними даними. Використовується як вхідний тип у utils.ts
export type PrismaOrderWithDetails = Prisma.OrderGetPayload<
	typeof orderWithItemsAndUser
>;

// CartItemType - Тип елемента кошика з ProductType
export type CartItemType = Omit<
	Prisma.CartItemGetPayload<typeof itemWithProductDetails>,
	// ✅ ВИПРАВЛЕНО: Явно OMIT поля, які ми перевизначаємо або змінюємо їх тип
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
export type CartType = Omit<
	Prisma.CartGetPayload<typeof orderWithItemsAndUser>,
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

// OrderType - Тип замовлення з локальними статусами
export type OrderType = OmitPrismaEnums<
	Prisma.OrderGetPayload<typeof orderWithItemsAndUser>
>;

// Тип для User
export type UserType = Pick<
	Prisma.UserGetPayload<undefined>,
	"id" | "name" | "email" | "role" | "image" | "emailVerified"
>;
