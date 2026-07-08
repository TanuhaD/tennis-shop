import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast"; // <--- Додайте цей імпорт

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Ваш Next.js Магазин",
	description: "Повнофункціональний інтернет-магазин",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="uk" data-theme="winter">
			<body className={inter.className}>
				{/* Тут можна додати Navbar та Footer, якщо вони ще не тут */}

				<main>{children}</main>

				{/* <--- Розміщення Toaster ---> */}
				<Toaster position="bottom-right" reverseOrder={false} />
			</body>
		</html>
	);
}
