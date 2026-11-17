import type { Event } from '@beatriz/shared/events';
import type { Ticket } from '@beatriz/shared/tickets';

export const getNameBlock = (name: Event['block']): string => {
	if (name === 'blue') return 'niebieska';
	else if (name === 'green') return 'zielona';
	else if (name === 'yellow') return 'żółta';
	else return 'czarna';
};

export const getNameTypeTicket = (type: Ticket['type']): string => {
	if (type === 'VIP') {
		return 'VIP';
	} else if (type === 'normal') {
		return 'Normalny';
	} else if (type === 'child') {
		return 'Dziecinny';
	} else return 'Unknown';
};
