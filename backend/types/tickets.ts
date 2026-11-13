import type { Ticket } from '../models/ticketModel.ts';
import type { SuccessList, SuccessItem, ErrorResponse } from './users.ts';

export type TicketDto = Pick<Ticket, '_id' | 'event' | 'seating' | 'user' | 'quantity' | 'price' | 'type' | 'date'> & {
	_v?: number;
};

export type GetAllTicketsResponse = SuccessList<'tickets'> | ErrorResponse;

export type GetUserTicketsResponse = GetAllTicketsResponse;

export type GroupAvailableSectorsRequest = {};

export type GroupAvailableSectorsResponse = {};

export type GetOccupiedSeatsRequest = {};

export type GetOccupiedSeatsResponse = {};
