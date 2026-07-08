import { PrismaClient } from "@prisma/client";

// ВИПРАВЛЕНО: Ми використовуємо JSDoc для типування, щоб Node.js міг виконати файл,
// а Next.js та TypeScript могли його перевірити.
/** @type {{ prismaUser?: PrismaClient }} */
const globalForPrisma = globalThis;

/** @type {PrismaClient} */
export const prismaUser =
	globalForPrisma.prismaUser ??
	new PrismaClient({
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	});

if (process.env.NODE_ENV !== "production")
	globalForPrisma.prismaUser = prismaUser;
