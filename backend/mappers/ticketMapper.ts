import type { TicketDto } from '@beatriz/shared';
import type { Ticket } from '../models/ticketModel.ts';

export const toTicketDto = (ticket: Ticket): TicketDto => ({
	_id: ticket._id,
	event: ticket.event,
	seating: ticket.seating,
	user: ticket.user,
	quantity: ticket.quantity,
	price: ticket.price,
	type: ticket.type,
	date: ticket.date,
});
