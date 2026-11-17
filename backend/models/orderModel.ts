import { model } from 'mongoose';
import { orderSchema } from '@beatriz/shared/schemas/orderSchema';

export type { Order } from '@beatriz/shared/orders';

const OrderModel = model('Order', orderSchema);

export default OrderModel;
