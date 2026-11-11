export const calculateTicketDiscount = price => {
	const daysUntilEvent = Math.floor((eventDate - Date.now()) / (1000 * 60 * 60 * 24));

	let discount = 0;

	if (daysUntilEvent >= 90) {
		discount = 0.25;
	} else if (daysUntilEvent >= 60) {
		discount = 0.15;
	} else if (daysUntilEvent >= 30) {
		discount = 0.1;
	}

	return (price * (1 - discount)).toFixed(2);
};
