import type { BlockType } from '@beatriz/shared/tickets';
import type { CssModuleClasses } from '@/shared/types/css';

export const getNameBlock = (name?: BlockType | null) => {
	const isBlue = name === 'blue';
	const isGreen = name === 'green';
	const isYellow = name === 'yellow';

	if (isBlue) return 'niebieska';
	else if (isGreen) return 'zielona';
	else if (isYellow) return 'żółta';
	else return 'czarna';
};

export const getNameTypeTicket = (type: string) => {
	const isVip = type === 'VIP';
	const isNormal = type === 'normal';
	const isChild = type === 'child';

	if (isVip) {
		return 'VIP';
	} else if (isNormal) {
		return 'Normalny';
	} else if (isChild) {
		return 'Dziecinny';
	} else return 'Unknown';
};

/**
 * Buduje klasę CSS dla odznaki strefy (block badge).
 */
export function getBlockBadgeClass(block: BlockType | null | undefined, classes: CssModuleClasses): string {
	const blockClass = `block-badge--${block}`;
	return `${classes['block-badge']} ${classes[blockClass]}`;
}
