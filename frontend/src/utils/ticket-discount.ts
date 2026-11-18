export const calculateTicketDiscount = price => {
	const daysUntilEvent = Math.floor((eventDate - Date.now()) / (1000 * 60 * 60 * 24));

	const isThreeMonthsAway = daysUntilEvent >= 90;
	const isTwoMonthsAway = daysUntilEvent >= 60;
	const isOneMonthAway = daysUntilEvent >= 30;

	let discount = 0;

	if (isThreeMonthsAway) {
		discount = 0.25;
	} else if (isTwoMonthsAway) {
		discount = 0.15;
	} else if (isOneMonthAway) {
		discount = 0.1;
	}

	return (price * (1 - discount)).toFixed(2);
};
