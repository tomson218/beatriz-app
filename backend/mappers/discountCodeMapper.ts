import type { DiscountCode } from '../models/discountCodeModel.ts';
import type { DiscountCodeDto } from '../types/discountCodes.ts';

export const toDiscountCodeDto = (discountCode: DiscountCode): DiscountCodeDto => ({
	_id: discountCode._id,
	code: discountCode.code,
	value: discountCode.value,
	expiration: discountCode.expiration,
	usageLimit: discountCode.usageLimit,
	usageConditions: discountCode.usageConditions,
});
