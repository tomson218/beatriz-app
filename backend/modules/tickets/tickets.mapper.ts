import type { TicketDto } from '@beatriz/shared/tickets';
import type { TicketDocument } from './tickets.type.ts';

export const toTicketDto = (ticket: TicketDocument): TicketDto => ({
	_id: ticket._id.toString(),
	eventId: ticket.eventId,
	event: ticket.get('event'),
	seating: ticket.seating,
	userId: ticket.userId,
	user: ticket.get('user'),
	quantity: ticket.quantity,
	price: ticket.price,
	type: ticket.type,
	date: ticket.date,
	status: ticket.status,
});
