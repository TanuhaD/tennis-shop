/**
 * Форматує ціну з центів у гривні (або долари, залежно від конфігурації)
 * і повертає відформатований рядок.
 *
 * @param priceInCents Ціна в копійках/центах (ціле число).
 * @returns Рядок у форматі "1,234.56 $".
 */
export function formatPrice(priceInCents: number): string {
	if (typeof priceInCents !== "number" || priceInCents < 0) {
		return "0.00 $";
	}

	const currencyAmount = priceInCents / 100;

	// Використовуємо регіональні налаштування для коректного форматування
	return (
		currencyAmount
			.toLocaleString("uk-UA", {
				style: "currency",
				currency: "USD", // Припускаємо USD, як було у попередніх прикладах
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})
			// Замінюємо символ валюти, щоб він був у кінці (з пробілом)
			.replace("$", " $")
	);
}
