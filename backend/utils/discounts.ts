export const calcDiscountPrice = (eventDate: Date): number => {
	const daysUntilEvent = Math.floor((new Date(eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

	if (daysUntilEvent >= 90) {
		return 0.25;
	} else if (daysUntilEvent >= 60) {
		return 0.15;
	} else if (daysUntilEvent >= 30) {
		return 0.1;
	} else if (daysUntilEvent >= 20) {
		return 1.1;
	} else if (daysUntilEvent >= 10) {
		return 1.2;
	} else if (daysUntilEvent >= 5) {
		return 1.3;
	}

	return 0;
};

/** Najpierw zaokrąglamy do groszy (usuwa błędy typu 110.00000000000001), potem w górę do pełnych złotych. */
const ceilToWholePln = (amount: number): number => Math.ceil(Math.round(amount * 100) / 100);

export const calcPricesAfterDiscount = (discount: number, prices: Record<string, number>): Record<string, number> => {
	const discountedEntries = Object.entries(prices).map(([key, value]) => {
		const amount: number = discount >= 1 ? value * discount : value - value * discount;

		return [key, ceilToWholePln(amount)];
	});

	return Object.fromEntries(discountedEntries);
};
