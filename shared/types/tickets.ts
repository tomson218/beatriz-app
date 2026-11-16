import type { SuccessList } from '@/common';
import type { Event, EventIdParams } from '@/events';
import type { User } from '@/users';

export type TicketType = 'normal' | 'VIP' | 'child';

export type BlockType = 'blue' | 'green' | 'yellow' | 'black';

export interface TicketSeating {
	sector: string;
	block: BlockType;
	seat: number;
}

export interface Ticket {
	_id: string;
	event: Event | Event["_id"];
	seating: TicketSeating;
	user: User["_id"];
	quantity: number;
	price: number;
	type: TicketType;
	date: string | Date;
	createdAt?: string;
	updatedAt?: string;
}

export interface TicketDto extends Omit<Ticket, '_id'> {
	_id: string;
}

export interface TicketIdParams {
	ticketId: Ticket["_id"];
}

export type EventTicketsParams = EventIdParams;

export interface OccupiedSeatsParams {
	eventId: Event["_id"];
	sector: string;
	block: BlockType;
}

export type TicketsResponse = SuccessList<TicketDto>;

export type GroupAvailableSectorsRequest = EventIdParams;

export type GroupAvailableSectorsResponse = SuccessList<string>;

export interface GetOccupiedSeatsRequest {
	eventId: Event["_id"];
	sector: string;
	block: BlockType;
}

export type GetOccupiedSeatsResponse = SuccessList<number>;
