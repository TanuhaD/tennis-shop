import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// ВИПРАВЛЕНО: Вам потрібно імпортувати Prisma Adapter, якщо ви його використовуєте
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prismaUser as prisma } from "@/lib/prismaUser";

// Об'єкт конфігурації для NextAuth
// Обов'язково експортуємо його, щоб використовувати з getServerSession в API роутах
export const authOptions: AuthOptions = {
	// adapter: PrismaAdapter(prisma), // Якщо ви використовуєте адаптер
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		// Додайте тут інші провайдери, якщо потрібно
	],
	// Додайте необхідні опції, такі як pages, callbacks, events
	// events: {
	//   signIn: async ({ user, isNewUser }) => {
	//     // Тут можна об'єднати кошики, якщо користувач входить
	//     // Якщо ви плануєте робити це, функція mergeCart має бути викликана тут
	//   },
	// },
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
