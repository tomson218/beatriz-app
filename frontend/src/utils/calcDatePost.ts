export const calcDatePost = (date: string) => {
	const currentDate = Date.now();
	const forumDate = new Date(date);
	const hoursDifference = (currentDate - forumDate.getTime()) / (1000 * 60 * 60);
	const daysDifference = hoursDifference / 24;
	const monthsDifference = daysDifference / 30;
	const yearsDifference = monthsDifference / 12;

	if (hoursDifference < 24) {
		return `${Math.floor(hoursDifference)} h`;
	}

	if (daysDifference < 30) {
		return `${Math.floor(daysDifference)} days`;
	}

	if (monthsDifference < 12) {
		return `${Math.floor(monthsDifference)} months`;
	}

	return `${Math.floor(yearsDifference)} years`;
};
