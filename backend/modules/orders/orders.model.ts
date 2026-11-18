import { model } from 'mongoose';
import { orderSchema } from '@beatriz/shared/schemas/orderSchema';

const OrderModel = model('Order', orderSchema);

export default OrderModel;
