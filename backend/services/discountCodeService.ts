import DiscountCodeModel from '../models/discountCodeModel.ts';
import UserModel from '../models/userModel.ts';
import AppError from '../utils/appError.ts';
import { validateNonNegativeNumber } from '../utils/validateNumbers.ts';
import type { DiscountCode, DiscountCodeDto } from '@beatriz/shared/discountCodes';
import type { User } from '@beatriz/shared/users';

export const getAllDiscountCodes = async (): Promise<DiscountCode[]> => {
	return DiscountCodeModel.find().select('-__v');
};

export const createDiscountCode = async (input: DiscountCodeDto): Promise<DiscountCode> => {
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
 * W przeciwnym razie rzuca błąd z powodem: brak kodu (404), kod wygasł, zbyt niska wartość zamówienia lub kod już użyty (400).
 */
export const getUsableDiscountCode = async (code: string, orderTotal: number, user: User): Promise<DiscountCode> => {
	const discountCode: DiscountCode | null = await DiscountCodeModel.findOne({ code });

	if (!discountCode) {
		throw new AppError('Discount code not found.', 404);
	}

	const isExpired = Date.now() > new Date(discountCode.expiration).getTime();

	if (isExpired) {
		throw new AppError('Discount code has expired.', 400);
	}

	const doesNotMeetUsageConditions = orderTotal < discountCode.usageConditions;

	if (doesNotMeetUsageConditions) {
		throw new AppError('Total amount does not meet the usage conditions.', 400);
	}

	const isAlreadyUsed = user.appliedDiscountCodes?.some(applied => applied.code === code && applied.isUsed === true);

	if (isAlreadyUsed) {
		throw new AppError('Discount code already applied.', 400);
	}

	return discountCode;
};

/** Zapisuje kod jako zastosowany przez użytkownika i zwraca wartość rabatu (ułamek od 0 do 1). */
export const applyDiscountCode = async (userId: string, enteredCode: string, orderTotal: number): Promise<number> => {
	validateNonNegativeNumber(orderTotal, 'Kwota zamówienia');

	const user: User | null = await UserModel.findById(userId);

	if (!user) {
		throw new AppError('User not found.', 404);
	}

	const discountCode = await getUsableDiscountCode(enteredCode, orderTotal, user);

	user.appliedDiscountCodes ??= [];
	user.appliedDiscountCodes.push({ isUsed: false, code: discountCode.code });
	await user.save();

	return discountCode.value;
};
