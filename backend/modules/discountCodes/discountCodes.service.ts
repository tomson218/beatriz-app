import DiscountCodeModel from './discountCodes.model.ts';
import UserModel from '../users/users.model.ts';
import { validateNonNegativeNumber } from '../../utils/validateNumbers.ts';
import type { DiscountCodeRequest } from '@beatriz/shared/discountCodes';
import type { UserDocument } from '../users/users.type.ts';
import type { DiscountCodeDocument } from './discountCodes.type.ts';

export const findAllDiscountCodes = async (): Promise<DiscountCodeDocument[]> => {
	return DiscountCodeModel.find().select('-__v');
};

export const createDiscountCode = async (input: DiscountCodeRequest): Promise<DiscountCodeDocument> => {
	validateNonNegativeNumber(input.value, 'Wartość rabatu');
	validateNonNegativeNumber(input.usageLimit, 'Limit użycia');
	validateNonNegativeNumber(input.usageConditions, 'Warunki użycia');

	return DiscountCodeModel.create({
		code: input.code,
		value: input.value,
		expiration: input.expiration,
		usageLimit: input.usageLimit,
		usageConditions: input.usageConditions,
	});
};

/**
 * Zwraca kod rabatowy, jeśli można go użyć dla zamówienia o danej wartości.
 * W przeciwnym razie rzuca błąd z powodem: brak kodu (404), kod wygasł lub zbyt niska wartość zamówienia (400), kod już użyty (409).
 */
export const getUsableDiscountCode = async (
	code: string,
	orderTotal: number,
	user: UserDocument,
): Promise<DiscountCodeDocument> => {
	const discountCode: DiscountCodeDocument | null = await DiscountCodeModel.findOne({ code });

	if (!discountCode) {
		throw Object.assign(new Error('Discount code not found.'), { statusCode: 404 });
	}

	if (Date.now() > new Date(discountCode.expiration).getTime()) {
		throw Object.assign(new Error('Discount code has expired.'), { statusCode: 400 });
	}

	if (orderTotal < discountCode.usageConditions) {
		throw Object.assign(new Error('Total amount does not meet the usage conditions.'), { statusCode: 400 });
	}

	const isAlreadyUsed: boolean = user.appliedDiscountCodes.some(
		applied => applied.code === code && applied.isUsed === true,
	);

	if (isAlreadyUsed) {
		throw Object.assign(new Error('Discount code already applied.'), { statusCode: 409 });
	}

	return discountCode;
};

/** Zapisuje kod jako zastosowany przez użytkownika i zwraca wartość rabatu (ułamek od 0 do 1). */
export const applyDiscountCode = async (userId: string, enteredCode: string, orderTotal: number): Promise<number> => {
	validateNonNegativeNumber(orderTotal, 'Kwota zamówienia');

	const user: UserDocument | null = await UserModel.findById(userId);

	if (!user) {
		throw Object.assign(new Error('User not found.'), { statusCode: 404 });
	}

	const discountCode: DiscountCodeDocument = await getUsableDiscountCode(enteredCode, orderTotal, user);

	user.appliedDiscountCodes.push({ isUsed: false, code: discountCode.code });
	await user.save();

	return discountCode.value;
};
