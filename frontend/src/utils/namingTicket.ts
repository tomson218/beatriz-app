import type { BlockType } from '@beatriz/shared/tickets';

export const getNameBlock = (name: BlockType) => {
	if (name === 'blue') return 'niebieska';
	else if (name === 'green') return 'zielona';
	else if (name === 'yellow') return 'żółta';
	else return 'czarna';
};

export const getNameTypeTicket = (type: string) => {
	if (type === 'VIP') {
		return 'VIP';
	} else if (type === 'normal') {
		return 'Normalny';
	} else if (type === 'child') {
		return 'Dziecinny';
	} else return 'Unknown';
};

/**
 * Buduje klasę CSS dla odznaki strefy (block badge).
 */
export function getBlockBadgeClass(block: BlockType, classes: Record<string, string>): string {
	const blockClass = `block-badge--${block}`;
	return `${classes['block-badge']} ${classes[blockClass]}`;
}


