export const formattedDate = (date: Date) => date.toLocaleDateString('pl-PL');
export const formattedTime = (time: Date) =>
	time.toLocaleTimeString('pl-PL', {
		hour: '2-digit',
		minute: '2-digit',
	});
