import type { ApiResponse, ListResponse } from '#types/common';
import type { Event } from '#types/events';
import type { User } from '#types/users';
import type { Types, InferSchemaType } from 'mongoose';
import type { ticketSchemaDef } from '#schemas/ticketSchema';
import type { TICKET_TYPES } from '#enums/ticketTypes';
import type { BLOCK_TYPES } from '#enums/blockTypes';

/** `user` i `event` to pola wirtualne: mają wartość tylko po `populate`. */
export type Ticket = InferSchemaType<typeof ticketSchemaDef> & { _id: Types.ObjectId; user?: User; event?: Event };
export type TicketType = (typeof TICKET_TYPES)[number];
export type BlockType = (typeof BLOCK_TYPES)[number];

export interface TicketDto extends Omit<Ticket, '_id'> {
	_id: string;
}

export interface TicketIdParams {
	ticketId: Ticket['_id'];
}

export type TicketRequest = Pick<Ticket, 'eventId' | 'type' | 'date' | 'price'> & {
	userId: User['_id'];
	seating: { sector: string; block: BlockType; seat: number };
};

export interface OccupiedSeatsParams {
	eventId: Event['_id'];
	sector: string;
	block: BlockType;
}

export type TicketsResponse = ListResponse<'tickets', TicketDto>;

/** `freeSectorsCount`: liczba wolnych miejsc w każdym sektorze wydarzenia, np. `{ A: 380, B: 400 }`. */
export type GroupAvailableSectorsResponse = ApiResponse<{
	results: number;
	freeSectorsCount: Record<string, number>;
}>;

export interface GetOccupiedSeatsRequest {
	eventId: Event['_id'];
	sector: string;
	block: BlockType;
}

export type GetOccupiedSeatsResponse = ApiResponse<{
	results: number;
	occupiedSeats: number[];
}>;
