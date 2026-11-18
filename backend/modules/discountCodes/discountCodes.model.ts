import { model } from 'mongoose';
import { discountCodeSchema } from '@beatriz/shared/schemas/discountCodeSchema';

const DiscountCodeModel = model('DiscountCode', discountCodeSchema, 'discountCodes');

export default DiscountCodeModel;
