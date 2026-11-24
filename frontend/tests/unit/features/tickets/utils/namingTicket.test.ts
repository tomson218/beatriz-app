import { getBlockBadgeClass, getNameBlock, getNameTypeTicket } from '@/features/tickets/utils/namingTicket';
import { getBlockLabel } from '@/features/tickets/utils/blockLabels';

describe('getNameBlock', () => {
	it.each([
		['blue', 'niebieska'],
		['green', 'zielona'],
		['yellow', 'żółta'],
		['black', 'czarna'],
	] as const)('translates %s to %s', (block, expected) => {
		const result = getNameBlock(block);

		expect(result).toBe(expected);
	});
});

describe('getNameTypeTicket', () => {
	it.each([
		['VIP', 'VIP'],
		['normal', 'Normalny'],
		['child', 'Dziecinny'],
		['senior', 'Unknown'],
	])('translates %s to %s', (type, expected) => {
		const result = getNameTypeTicket(type);

		expect(result).toBe(expected);
	});
});

describe('getBlockBadgeClass', () => {
	it('combines the base badge class with the block modifier', () => {
		const classes = { 'block-badge': 'badge_x1', 'block-badge--green': 'badge-green_x2' };

		const result = getBlockBadgeClass('green', classes);
		const expected = 'badge_x1 badge-green_x2';

		expect(result).toBe(expected);
	});
});

describe('getBlockLabel', () => {
	it.each([
		['blue', 'Niebieska strefa'],
		['black', 'Czarna strefa'],
		['purple', 'purple'],
	])('labels %s as %s', (block, expected) => {
		const result = getBlockLabel(block);

		expect(result).toBe(expected);
	});
});
