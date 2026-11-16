import type { SuccessItem, SuccessList } from '@/common';

export interface DiscountCode {
	_id: string;
	code: string;
	value: number;
	expiration: string | Date;
	usageLimit: number;
	usageConditions: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface DiscountCodeDto extends Omit<DiscountCode, '_id'> {
	_id: string;
}

export type GetAllDiscountCodesResponse = SuccessList<DiscountCodeDto>;

export type AddDiscountCodeRequest = Pick<DiscountCode, 'code' | 'value' | 'usageLimit' | 'usageConditions' | 'expiration'>;

export type AddDiscountCodeResponse = SuccessItem<DiscountCodeDto>;

export interface ApplyDiscountCodeRequest {
	enteredCode: string;
	totalPrice: number;
}

export interface ApplyDiscountCodeResponse {
	discount?: number;
	message?: string;
}
