import { NEW_EVENT } from '@beatriz/shared/constants/misc';

export const checkEventIsNew = (date: Date) => {
	const differenceInDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);

	const isNewEvent = differenceInDays <= NEW_EVENT;

	return isNewEvent;
};
