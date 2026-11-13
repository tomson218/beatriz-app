import type { Ticket } from '../models/ticketModel.ts';
import type { SuccessList, SuccessItem, ErrorResponse } from './users.ts';

export type TicketDto = Pick<Ticket, '_id' | 'event' | 'seating' | 'user' | 'quantity' | 'price' | 'type' | 'date'> & {
	_v?: number;
};

export type TicketSeating = Ticket['seating'];

export type TicketIdParams = { id: Ticket['_id'] };
export type EventTicketsParams = { eventId: Ticket['event'] };
export type OccupiedSeatsParams = {
	eventId: Ticket['event'];
	sector: TicketSeating['sector'];
	block: TicketSeating['block'];
};

export type GetAllTicketsResponse = SuccessList<'tickets'> | ErrorResponse;

export type GetUserTicketsResponse = GetAllTicketsResponse;

export type GroupAvailableSectorsRequest = EventTicketsParams;

export type GroupAvailableSectorsResponse =
	| {
			status: 'success';
			data: {
				results: number;
				freeSectorsCount: Record<string, number>;
			};
	  }
	| ErrorResponse;

export type GetOccupiedSeatsRequest = OccupiedSeatsParams;

export type GetOccupiedSeatsResponse =
	| {
			status: 'success';
			data: {
				results: number;
				occupiedSeats: number[];
			};
	  }
	| ErrorResponse;
