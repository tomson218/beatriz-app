import type { Order, OrderDto } from '@beatriz/shared/orders';

export const toOrderDto = (order: Order): OrderDto => ({
	_id: order._id,
	totalAmount: order.totalAmount,
	date: order.date,
	user: order.user,
	currency: order.currency,
	tickets: order.tickets,
	countOfTickets: order.countOfTickets,
});
