export const calcDiscountPrice = (eventDate: Date) => {
	const daysUntilEvent = Math.floor((new Date(eventDate) - Date.now()) / (1000 * 60 * 60 * 24));

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

export const calcPricesAfterDiscount = (discount: number, prices: any) => {
	const discountedEntries = Object.entries(prices).map(([key, value]) => {
		if (discount >= 1) {
			return [key, Math.ceil(value * discount)];
		} else {
			return [key, Math.ceil(value - value * discount)];
		}
	});

	return Object.fromEntries(discountedEntries);
};
