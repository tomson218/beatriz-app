import type { HydratedDocumentFromSchema } from 'mongoose';
import type { discountCodeSchema } from '@beatriz/shared/schemas/discountCodeSchema';

export type DiscountCodeDocument = HydratedDocumentFromSchema<typeof discountCodeSchema>;
