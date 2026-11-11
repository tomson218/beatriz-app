import { getNameBlock, getNameTypeTicket } from '@/utils/namingTicket';

describe('BLOCKS AND TYPE TICKETS', () => {
	test('Get name block', () => {
		const result = getNameBlock('blue');
		expect(result).toBe('niebieska');
	});

	test('Get name type ticket', () => {
		const result = getNameTypeTicket('normal');
		expect(result).toBe('Normalny');
	});
});
