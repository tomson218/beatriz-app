import type { SuccessList } from '@/types/common';
import type { Event } from '@/types/events';
import type { User } from '@/types/users';
import { Types, type InferSchemaType } from 'mongoose';
import { ticketSchemaDef } from '@/schemas/ticketSchema';
import { TICKET_TYPES } from '@/enums/ticketTypes';
import { BLOCK_TYPES } from '@/enums/blockTypes';

export type Ticket = InferSchemaType<typeof ticketSchemaDef> & { _id: Types.ObjectId };
export type TicketType = (typeof TICKET_TYPES)[number];
export type BlockType = (typeof BLOCK_TYPES)[number];

export interface TicketDto extends Omit<Ticket, '_id'> {
	_id: string;
}

export interface TicketIdParams {
	ticketId: Ticket["_id"];
}

export type TicketRequest = Pick<Ticket, 'event' | 'type' | 'date' | 'price'> & {
	user: User["_id"];
	seating: { sector: string; block: BlockType; seat: number };
};

export interface OccupiedSeatsParams {
	eventId: Event["_id"];
	sector: string;
	block: BlockType;
}

export type TicketsResponse = SuccessList<TicketDto>;

export type GroupAvailableSectorsResponse = SuccessList<string>;

export interface GetOccupiedSeatsRequest {
	eventId: Event["_id"];
	sector: string;
	block: BlockType;
}

export type GetOccupiedSeatsResponse = SuccessList<number>;
