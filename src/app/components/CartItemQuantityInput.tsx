"use client";

import React, {
	useState,
	useTransition,
	ChangeEvent,
	useEffect,
	useRef,
} from "react";
import { Minus, Plus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface CartItemQuantityInputProps {
	productId: string;
	initialQuantity: number;
	updateCartItemQuantity: (
		productId: string,
		quantity: number
	) => Promise<void>;
}

const MAX_QUANTITY = 99;
const DEBOUNCE_DELAY = 400; // ⏱ ключова магія

export default function CartItemQuantityInput({
	productId,
	initialQuantity,
	updateCartItemQuantity,
}: CartItemQuantityInputProps) {
	// 🔹 локальний UI-стан
	const [quantity, setQuantity] = useState(initialQuantity);

	// 🔹 transition для server action
	const [isPending, startTransition] = useTransition();

	// 🔹 debounce таймер
	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	/* --------------------------------------------------
	   Sync з cart (rollback / refresh)
	-------------------------------------------------- */
	useEffect(() => {
		setQuantity(initialQuantity);
	}, [initialQuantity]);

	/* --------------------------------------------------
	   Debounce → server
	-------------------------------------------------- */
	useEffect(() => {
		// якщо значення не змінилось — нічого не робимо
		if (quantity === initialQuantity) return;

		// чистимо попередній таймер
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		// ставимо новий
		debounceRef.current = setTimeout(() => {
			startTransition(async () => {
				try {
					await updateCartItemQuantity(productId, quantity);
				} catch {
					setQuantity(initialQuantity); // 🔄 rollback UI
					toast.error("Не вдалося оновити кількість");
				}
			});
		}, DEBOUNCE_DELAY);

		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, [quantity, initialQuantity, productId, updateCartItemQuantity]);

	/* --------------------------------------------------
	   UI handlers (тільки UI!)
	-------------------------------------------------- */

	const clamp = (value: number) => Math.min(MAX_QUANTITY, Math.max(0, value));

	const handleIncrement = () => {
		if (quantity >= MAX_QUANTITY) {
			toast.error(`Максимум ${MAX_QUANTITY}`);
			return;
		}
		setQuantity((q) => clamp(q + 1));
	};

	const handleDecrement = () => {
		setQuantity((q) => clamp(q - 1));
	};

	const handleManualChange = (e: ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;

		if (val === "") {
			setQuantity(0);
			return;
		}

		const parsed = Number(val);
		if (!isNaN(parsed)) {
			setQuantity(clamp(parsed));
		}
	};

	return (
		<div className="flex items-center gap-2">
			<div className="flex items-center border rounded-lg shadow-sm w-32">
				<button
					onClick={handleDecrement}
					disabled={isPending || quantity <= 0}
					className="p-2 disabled:opacity-50">
					<Minus size={14} />
				</button>

				<input
					type="number"
					min={0}
					max={MAX_QUANTITY}
					value={quantity}
					onChange={handleManualChange}
					disabled={isPending}
					className="w-14 text-center border-x"
				/>

				<button
					onClick={handleIncrement}
					disabled={isPending || quantity >= MAX_QUANTITY}
					className="p-2 disabled:opacity-50">
					<Plus size={14} />
				</button>
			</div>

			{isPending && (
				<RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
			)}
		</div>
	);
}
