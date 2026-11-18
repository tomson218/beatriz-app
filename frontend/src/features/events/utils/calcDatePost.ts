export const calcDatePost = (date: string) => {
	const currentDate = Date.now();
	const forumDate = new Date(date);
	const hoursDifference = (currentDate - forumDate.getTime()) / (1000 * 60 * 60);
	const daysDifference = hoursDifference / 24;
	const monthsDifference = daysDifference / 30;
	const yearsDifference = monthsDifference / 12;

	const isLessThanDayAgo = hoursDifference < 24;
	const isLessThanMonthAgo = daysDifference < 30;
	const isLessThanYearAgo = monthsDifference < 12;

	if (isLessThanDayAgo) {
		return `${Math.floor(hoursDifference)} h`;
	}

	if (isLessThanMonthAgo) {
		return `${Math.floor(daysDifference)} days`;
	}

	if (isLessThanYearAgo) {
		return `${Math.floor(monthsDifference)} months`;
	}

	return `${Math.floor(yearsDifference)} years`;
};
