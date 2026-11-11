import { NEW_EVENT } from '@/constants/constants';

export const checkEventIsNew = (date: Date) => {
	const differenceInDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);

	if (differenceInDays <= NEW_EVENT) return true;
	else return false;
};
