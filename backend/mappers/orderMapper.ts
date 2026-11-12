import type { OrderDto } from '../types/orders.ts';
import type { Order } from '../models/orderModel.ts';

export const toOrderDto = (order: Order): OrderDto => ({
	_id: order._id,
	totalAmount: order.totalAmount,
	date: order.date,
	user: order.user,
	currency: order.currency,
	tickets: order.tickets,
	countOfTickets: order.countOfTickets,
});
