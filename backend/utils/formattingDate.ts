export const formattedDate = (date: Date): string => date.toLocaleDateString('pl-PL');

export const formattedTime = (time: Date): string =>
	time.toLocaleTimeString('pl-PL', {
		hour: '2-digit',
		minute: '2-digit',
	});
