import { getCart } from "@/lib/db/cart";
import CartClient from "../components/CartClient";

export const metadata = {
	title: "Ваш кошик - Tennis.ua",
};

export default async function CartPage() {
	const cart = await getCart();

	return <CartClient initialCart={cart} />;
}
