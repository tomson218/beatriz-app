import type { Order, OrderDto, OrderTicket } from './orders.type.ts';

/** Pola wirtualne nie trafiają do JSON-a subdokumentu, dlatego `event` jest przepisywany jawnie. */
const toOrderTicketDto = (ticket: OrderTicket): OrderTicket => ({
	_id: ticket._id,
	eventId: ticket.eventId,
	event: ticket.event,
	seating: ticket.seating,
	price: ticket.price,
	type: ticket.type,
});

export const toOrderDto = (order: Order): OrderDto => ({
	_id: order._id,
	totalAmount: order.totalAmount,
	date: order.date,
	userId: order.userId,
	user: order.user,
	currency: order.currency,
	tickets: order.tickets.map(toOrderTicketDto),
	countOfTickets: order.countOfTickets,
});
