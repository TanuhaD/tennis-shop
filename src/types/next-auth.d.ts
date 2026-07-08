import { DefaultSession, DefaultUser } from "next-auth";

// Розширення стандартного типу 'next-auth'
declare module "next-auth" {
	/**
	 * Повернений тип 'user' після виклику Provider.
	 * Ми розширюємо його, щоб він включав id.
	 */
	interface User extends DefaultUser {
		id: string; // Включення ID користувача
	}

	/**
	 * Повернений тип 'session' після виклику useSession, getSession або getServerSession.
	 */
	interface Session {
		user: {
			id: string; // Включення ID користувача в об'єкт User сесії
		} & DefaultSession["user"]; // Включення інших стандартних полів (name, email, image)
	}
}

// Розширення типу 'next-auth/jwt'
declare module "next-auth/jwt" {
	/**
	 * Повернений тип 'token' від jwt callback.
	 */
	interface JWT {
		user: {
			id: string; // Включення ID користувача в JWT токен
		};
	}
}
