import type { SuccessItem, SuccessList } from '@/types/common';
import { Types, type InferSchemaType } from 'mongoose';
import { discountCodeSchema } from '@/schemas/discountCodeSchema';

export type DiscountCode = InferSchemaType<typeof discountCodeSchema> & { _id: Types.ObjectId };

export interface DiscountCodeDto extends Omit<DiscountCode, '_id'> {
	_id: string;
}

export type GetAllDiscountCodesResponse = SuccessList<DiscountCodeDto>;

export type DiscountCodeRequest = Pick<DiscountCode, 'code' | 'value' | 'usageLimit' | 'usageConditions' | 'expiration'>;

export type AddDiscountCodeResponse = SuccessItem<DiscountCodeDto>;

export interface ApplyDiscountCodeRequest {
	enteredCode: string;
	totalPrice: number;
}

export interface ApplyDiscountCodeResponse {
	discount?: number;
	message?: string;
}
