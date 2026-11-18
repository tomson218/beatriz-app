import type { DiscountCodeDto } from '@beatriz/shared/discountCodes';
import type { DiscountCodeDocument } from './discountCodes.type.ts';

export const toDiscountCodeDto = (discountCode: DiscountCodeDocument): DiscountCodeDto => ({
	_id: discountCode._id.toString(),
	code: discountCode.code,
	value: discountCode.value,
	expiration: discountCode.expiration,
	usageLimit: discountCode.usageLimit,
	usageConditions: discountCode.usageConditions,
});
