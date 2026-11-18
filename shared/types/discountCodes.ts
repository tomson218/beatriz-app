import type { ApiResponse, ItemResponse, ListResponse } from '#types/common';
import type { Types, InferSchemaType } from 'mongoose';
import type { discountCodeSchema } from '#schemas/discountCodeSchema';

export type DiscountCode = InferSchemaType<typeof discountCodeSchema> & { _id: Types.ObjectId };

export interface DiscountCodeDto extends Omit<DiscountCode, '_id'> {
	_id: string;
}

export type GetAllDiscountCodesResponse = ListResponse<'discountCodes', DiscountCodeDto>;

export type DiscountCodeRequest = Pick<DiscountCode, 'code' | 'value' | 'usageLimit' | 'usageConditions' | 'expiration'>;

export type AddDiscountCodeResponse = ItemResponse<'newDiscountCode', DiscountCodeDto>;

export interface ApplyDiscountCodeRequest {
	enteredCode: string;
	totalPrice: number;
}

/** `discount` to ułamek od 0 do 1 (np. 0.2 = -20%). */
export type ApplyDiscountCodeResponse = ApiResponse<{ discount: number }>;
