import { PrismaClient } from "@prisma/client";

// ВИПРАВЛЕНО: Ми використовуємо JSDoc для типування, щоб Node.js міг виконати файл,
// а Next.js та TypeScript могли його перевірити.
/** @type {{ prismaAdmin?: PrismaClient }} */
const globalForPrisma = globalThis;

/** @type {PrismaClient} */
export const prismaAdmin =
	globalForPrisma.prismaAdmin ??
	new PrismaClient({
		datasources: {
			db: {
				// У seed-файлі ми посилаємося на ADMIN_DATABASE_URL
				url: process.env.ADMIN_DATABASE_URL,
			},
		},
	});

if (process.env.NODE_ENV !== "production")
	globalForPrisma.prismaAdmin = prismaAdmin;
