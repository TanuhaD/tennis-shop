// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SessionProviderWrapper from "@/app/providers/SessionProviderWrapper";
import { CartProvider } from "../context/CartContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Tennis Shop",
	description: "Online tennis store",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="uk">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<SessionProviderWrapper>
					<CartProvider>
						<Navbar />
						<main className="min-w-0 mx-auto">{children}</main>
						<Footer />
						<Toaster position="top-right" />
					</CartProvider>
				</SessionProviderWrapper>
			</body>
		</html>
	);
}
