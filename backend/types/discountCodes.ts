import type { DiscountCode } from '../models/discountCodeModel.ts';
import type { SuccessList, SuccessItem, ErrorResponse } from './users.ts';

export type DiscountCodeDto = Pick<
	DiscountCode,
	'_id' | 'code' | 'value' | 'expiration' | 'usageLimit' | 'usageConditions'
>;

export type GetAllDiscountCodesResponse = SuccessList<'discountCodes'> | ErrorResponse;

export type AddDiscountCodeRequest = Pick<
	DiscountCodeDto,
	'code' | 'value' | 'expiration' | 'usageLimit' | 'usageConditions'
>;

export type AddDiscountCodeResponse = SuccessItem<'discountCode'> | ErrorResponse;

export type ApplyDiscountCodeRequest = {
	enteredCode: any;
	totalAmount: any;
};

export type ApplyDiscountCodeResponse = {}; // | { status: 'error' | 'fail'; message: string };
