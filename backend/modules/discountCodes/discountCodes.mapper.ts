import type { DiscountCode, DiscountCodeDto } from './discountCodes.type.ts';

export const toDiscountCodeDto = (discountCode: DiscountCode): DiscountCodeDto => ({
	_id: discountCode._id,
	code: discountCode.code,
	value: discountCode.value,
	expiration: discountCode.expiration,
	usageLimit: discountCode.usageLimit,
	usageConditions: discountCode.usageConditions,
});
