import type { OrderDto, OrderTicket } from '@beatriz/shared/orders';
import { getOfflinePaymentDeadline } from '../../utils/offlinePayment.ts';
import type { OrderDocument } from './orders.type.ts';

/** Pola wirtualne nie trafiają do JSON-a subdokumentu, dlatego `event` jest przepisywany jawnie. */
const toOrderTicketDto = (ticket: OrderTicket): OrderTicket => ({
	_id: ticket._id,
	eventId: ticket.eventId,
	event: ticket.event,
	seating: ticket.seating,
	price: ticket.price,
	type: ticket.type,
});

export const toOrderDto = (order: OrderDocument): OrderDto => ({
	_id: order._id.toString(),
	totalAmount: order.totalAmount,
	date: order.date,
	userId: order.userId,
	user: order.get('user'),
	currency: order.currency,
	tickets: order.tickets.map(toOrderTicketDto),
	countOfTickets: order.countOfTickets,
	paymentMethod: order.paymentMethod,
	status: order.status,
	expiresAt: order.status === 'pending' ? getOfflinePaymentDeadline(order.date) : undefined,
});
