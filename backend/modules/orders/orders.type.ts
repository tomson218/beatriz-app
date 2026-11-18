import type { HydratedDocumentFromSchema } from 'mongoose';
import type { orderSchema } from '@beatriz/shared/schemas/orderSchema';

export type OrderDocument = HydratedDocumentFromSchema<typeof orderSchema>;

export interface OrderRouteParams {
	id: string;
}
