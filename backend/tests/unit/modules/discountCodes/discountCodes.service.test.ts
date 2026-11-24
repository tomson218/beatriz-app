import { describe, expect, it, vi } from 'vitest';
import DiscountCodeModel from '../../../../modules/discountCodes/discountCodes.model.ts';
import UserModel from '../../../../modules/users/users.model.ts';
import { mockQuery } from '../../../helpers/mockQuery.ts';
import { catchAsyncError } from '../../../helpers/catchError.ts';
import {
	applyDiscountCode,
	createDiscountCode,
	findAllDiscountCodes,
	getUsableDiscountCode,
} from '../../../../modules/discountCodes/discountCodes.service.ts';

vi.mock('../../../../modules/discountCodes/discountCodes.model.ts', () => ({
	default: { find: vi.fn(), create: vi.fn(), findOne: vi.fn() },
}));
vi.mock('../../../../modules/users/users.model.ts', () => ({ default: { findById: vi.fn() } }));

const DiscountCode = vi.mocked(DiscountCodeModel);
const User = vi.mocked(UserModel);

const futureDate = () => new Date(Date.now() + 24 * 60 * 60 * 1000);
const pastDate = () => new Date(Date.now() - 1000);

const fakeCode = (overrides: Record<string, unknown> = {}) => ({
	code: 'PROMO20',
	value: 0.2,
	expiration: futureDate(),
	usageLimit: 10,
	usageConditions: 100,
	...overrides,
});

const fakeUser = (appliedDiscountCodes: { code: string; isUsed: boolean }[] = []) => ({
	appliedDiscountCodes,
	save: vi.fn(),
});

describe('findAllDiscountCodes', () => {
	it('returns codes without the version field', async () => {
		const codes = [fakeCode()];
		const query = mockQuery(codes);
		DiscountCode.find.mockReturnValue(query as never);

		const result = await findAllDiscountCodes();
		const expected = codes;

		expect(result).toEqual(expected);
		expect(query.select).toHaveBeenCalledWith('-__v');
	});
});

describe('createDiscountCode', () => {
	const input = { code: 'NEW10', value: 0.1, expiration: futureDate(), usageLimit: 5, usageConditions: 50 };

	it('returns the created code', async () => {
		DiscountCode.create.mockResolvedValue('created' as never);

		const result = await createDiscountCode(input);
		const expected = 'created';

		expect(result).toBe(expected);
	});

	it('creates the code only from explicit fields', async () => {
		await createDiscountCode({ ...input, extra: 'x' } as never);
		const expected = input;

		expect(DiscountCode.create).toHaveBeenCalledWith(expected);
	});

	it.each([
		['value', 'Wartość rabatu'],
		['usageLimit', 'Limit użycia'],
		['usageConditions', 'Warunki użycia'],
	])('rejects a negative %s', async (field, label) => {
		const result = await catchAsyncError(createDiscountCode({ ...input, [field]: -1 }));
		const expected = { statusCode: 400, message: `${label} nie może być liczbą ujemną` };

		expect(result).toMatchObject(expected);
		expect(DiscountCode.create).not.toHaveBeenCalled();
	});
});

describe('getUsableDiscountCode', () => {
	it('returns the code when all conditions are met', async () => {
		const code = fakeCode();
		DiscountCode.findOne.mockResolvedValue(code as never);

		const result = await getUsableDiscountCode('PROMO20', 100, fakeUser() as never);
		const expected = code;

		expect(result).toBe(expected);
		expect(DiscountCode.findOne).toHaveBeenCalledWith({ code: 'PROMO20' });
	});

	it('allows a code that was applied but not used yet (e.g. abandoned payment)', async () => {
		const code = fakeCode();
		DiscountCode.findOne.mockResolvedValue(code as never);
		const user = fakeUser([
			{ code: 'PROMO20', isUsed: false },
			{ code: 'OTHER', isUsed: true },
		]);

		const result = await getUsableDiscountCode('PROMO20', 100, user as never);
		const expected = code;

		expect(result).toBe(expected);
	});

	it.each([
		['the code does not exist', null, 99999, [], { statusCode: 404, message: 'Discount code not found.' }],
		[
			'the code has expired',
			fakeCode({ expiration: pastDate() }),
			100,
			[],
			{ statusCode: 400, message: 'Discount code has expired.' },
		],
		[
			'the order total is below the usage condition',
			fakeCode(),
			99.99,
			[],
			{ statusCode: 400, message: 'Total amount does not meet the usage conditions.' },
		],
		[
			'the user has already used the code',
			fakeCode(),
			100,
			[{ code: 'PROMO20', isUsed: true }],
			{ statusCode: 409, message: 'Discount code already applied.' },
		],
	])('throws when %s', async (_label, code, orderTotal, applied, expected) => {
		DiscountCode.findOne.mockResolvedValue(code as never);

		const result = await catchAsyncError(getUsableDiscountCode('PROMO20', orderTotal, fakeUser(applied) as never));

		expect(result).toMatchObject(expected);
	});
});

describe('applyDiscountCode', () => {
	it('returns the discount value', async () => {
		User.findById.mockResolvedValue(fakeUser() as never);
		DiscountCode.findOne.mockResolvedValue(fakeCode() as never);

		const result = await applyDiscountCode('user-1', 'PROMO20', 150);
		const expected = 0.2;

		expect(result).toBe(expected);
	});

	it('records the code as applied but not used yet', async () => {
		const user = fakeUser();
		User.findById.mockResolvedValue(user as never);
		DiscountCode.findOne.mockResolvedValue(fakeCode() as never);

		await applyDiscountCode('user-1', 'PROMO20', 150);
		const result = user.appliedDiscountCodes;
		const expected = [{ isUsed: false, code: 'PROMO20' }];

		expect(result).toEqual(expected);
		expect(user.save).toHaveBeenCalled();
	});

	it('rejects a negative order total before touching the database', async () => {
		const result = await catchAsyncError(applyDiscountCode('user-1', 'PROMO20', -5));
		const expected = { statusCode: 400, message: 'Kwota zamówienia nie może być liczbą ujemną' };

		expect(result).toMatchObject(expected);
		expect(User.findById).not.toHaveBeenCalled();
	});

	it('throws 404 when the user does not exist', async () => {
		User.findById.mockResolvedValue(null);

		const result = await catchAsyncError(applyDiscountCode('user-1', 'PROMO20', 150));
		const expected = { statusCode: 404, message: 'User not found.' };

		expect(result).toMatchObject(expected);
	});

	it('does not save the user when the code is not usable', async () => {
		const user = fakeUser();
		User.findById.mockResolvedValue(user as never);
		DiscountCode.findOne.mockResolvedValue(null);

		const result = await catchAsyncError(applyDiscountCode('user-1', 'NOPE', 150));
		const expected = { statusCode: 404 };

		expect(result).toMatchObject(expected);
		expect(user.save).not.toHaveBeenCalled();
	});
});
