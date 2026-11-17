import { model } from 'mongoose';
import { discountCodeSchema } from '@beatriz/shared/schemas/discountCodeSchema';

export type { DiscountCode } from '@beatriz/shared/discountCodes';

const DiscountCodeModel = model('DiscountCode', discountCodeSchema, 'discountCodes');

export default DiscountCodeModel;
