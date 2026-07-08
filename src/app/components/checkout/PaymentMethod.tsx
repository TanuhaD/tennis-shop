"use client";

interface Props {
	value: "cod" | "online";
	onChange: (value: "cod" | "online") => void;
}

export default function PaymentMethod({ value, onChange }: Props) {
	return (
		<div className="space-y-3">
			<label className="flex items-center justify-between border p-4 rounded-lg cursor-pointer">
				<span className="font-medium">Оплата при отриманні</span>
				<input
					type="radio"
					checked={value === "cod"}
					onChange={() => onChange("cod")}
				/>
			</label>

			<label className="flex items-center justify-between border p-4 rounded-lg cursor-pointer opacity-50">
				<span className="font-medium">Онлайн оплата (Stripe / LiqPay)</span>
				<input
					type="radio"
					disabled
					checked={value === "online"}
					onChange={() => onChange("online")}
				/>
			</label>
		</div>
	);
}
