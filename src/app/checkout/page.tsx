import CheckoutForm from "../components/checkout/CheckoutForm";

export const metadata = {
	title: "Оформлення замовлення – Tennis.ua",
};

export default function CheckoutPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<CheckoutForm />
		</div>
	);
}
