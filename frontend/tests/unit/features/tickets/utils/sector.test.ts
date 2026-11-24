import { buildBlocksUrl, isEmptyMessage, isSectorAvailable } from '@/features/tickets/utils/sector';

describe('isSectorAvailable', () => {
	it.each([
		['A', ['A', 'B'], true],
		['C', ['A', 'B'], false],
		['A', [], false],
	])('sector %s in %j -> %s', (sector, sectors, expected) => {
		const result = isSectorAvailable(sector, sectors);

		expect(result).toBe(expected);
	});
});

describe('buildBlocksUrl', () => {
	it('builds the blocks URL for the selected sector', () => {
		const result = buildBlocksUrl('event-1', 'B');
		const expected = '/blocks?eventId=event-1&sector=B';

		expect(result).toBe(expected);
	});

	it('returns an empty string when no sector is selected', () => {
		const result = buildBlocksUrl('event-1', '');
		const expected = '';

		expect(result).toBe(expected);
	});
});

describe('isEmptyMessage', () => {
	it.each([
		['', true],
		['   \n\t', true],
		['Hej', false],
		['  Hej  ', false],
	])('%j -> %s', (message, expected) => {
		const result = isEmptyMessage(message);

		expect(result).toBe(expected);
	});
});
