/** Zwraca kod rabatowy zastosowany w koszyku. Ceny i rabat i tak wylicza serwer. */
export const getStoredDiscountCode = (): string | undefined => {
	try {
		const storedCode: unknown = JSON.parse(localStorage.getItem('code') ?? 'null');

		return typeof storedCode === 'string' && storedCode ? storedCode : undefined;
	} catch {
		return undefined;
	}
};
