export const formattedDate = date => date.toLocaleDateString('pl-PL');

export const formattedTime = time =>
	time.toLocaleTimeString('pl-PL', {
		hour: '2-digit',
		minute: '2-digit',
	});
