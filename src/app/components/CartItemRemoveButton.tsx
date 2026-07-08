"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface CartItemRemoveButtonProps {
	productId: string;
	productName: string;
	onRemove: (productId: string) => Promise<void>;
}

export default function CartItemRemoveButton({
	productId,
	productName,
	onRemove,
}: CartItemRemoveButtonProps) {
	const [isPending, startTransition] = useTransition();

	const handleRemove = () => {
		startTransition(async () => {
			try {
				await onRemove(productId);
				toast.success(`Товар "${productName}" видалено.`);
			} catch (error) {
				console.error("Помилка видалення:", error);
				toast.error("Не вдалося видалити товар.");
			}
		});
	};

	return (
		<button
			onClick={handleRemove}
			disabled={isPending}
			className="btn btn-ghost btn-square btn-sm text-red-500 hover:text-red-700 disabled:opacity-50"
			aria-label="Видалити товар">
			{isPending ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Trash2 size={20} />
			)}
		</button>
	);
}
