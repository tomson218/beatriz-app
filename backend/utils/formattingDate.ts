export const formattedDate = (date: any): any => date.toLocaleDateString('pl-PL');

export const formattedTime = (time: any): any =>
	time.toLocaleTimeString('pl-PL', {
		hour: '2-digit',
		minute: '2-digit',
	});
