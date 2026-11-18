import type { Ticket, TicketDto } from './tickets.type.ts';

export const toTicketDto = (ticket: Ticket): TicketDto => ({
	_id: ticket._id,
	eventId: ticket.eventId,
	event: ticket.event,
	seating: ticket.seating,
	userId: ticket.userId,
	user: ticket.user,
	quantity: ticket.quantity,
	price: ticket.price,
	type: ticket.type,
	date: ticket.date,
});
