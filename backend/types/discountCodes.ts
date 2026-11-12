import type { DiscountCode } from '../models/discountCodeModel.ts';

export type DiscountCodeDto = Pick<
	DiscountCode,
	'_id' | 'code' | 'value' | 'expiration' | 'usageLimit' | 'usageConditions'
>;

export type GetAllDiscountCodesResponse = {
	status: 'success';
	results: number;
	discountCodes: DiscountCodeDto[];
};

export type AddDiscountCodeRequest = Pick<
	DiscountCodeDto,
	'code' | 'value' | 'expirationDate' | 'usageLimit' | 'minAmountOrder'
>;

export type AddDiscountCodeResponse = {}; // | { status: 'error' | 'fail'; message: string };

export type ApplyDiscountCodeRequest = {
	enteredCode: any;
	totalAmount: any;
};

export type ApplyDiscountCodeResponse = {}; // | { status: 'error' | 'fail'; message: string };
