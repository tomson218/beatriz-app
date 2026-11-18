import type { ItemResponse, ListResponse } from '#types/common';
import type { Event } from '#types/events';
import type { BlockType, TicketType } from '#types/tickets';
import type { User } from '#types/users';
import type { Types, InferSchemaType } from 'mongoose';
import type { orderSchema } from '#schemas/orderSchema';
import type { CURRENCIES } from '#enums/currencies';

/** `user`, `event` i `tickets[].event` to pola wirtualne: mają wartość tylko po `populate`. */
export type Order = Omit<InferSchemaType<typeof orderSchema>, 'tickets'> & {
	_id: Types.ObjectId;
	tickets: OrderTicket[];
	user?: User;
	event?: Event;
};
export type Currency = (typeof CURRENCIES)[number];

export interface Seating {
	sector: string;
	block: BlockType;
	seat: number;
}

export interface OrderTicket {
	_id?: Types.ObjectId;
	eventId: Event["_id"];
	event?: Event;
	seating: Seating[];
	price: number;
	type: TicketType;
}

export interface CartTicket {
	eventId: Event["_id"];
	sector: string;
	block: BlockType;
	seating?: string;
	price: number;
	type: TicketType;
	name?: string;
	date?: string | Date;
	images?: string[];
}

export interface OrderDto extends Omit<Order, '_id'> {
	_id: string;
}

export interface OrderIdParams {
	orderId: Order["_id"];
}

export type GetAllOrdersResponse = ListResponse<'orders', OrderDto>;

export type OrderRequest = Pick<Order, 'totalAmount' | 'currency'> & {
	userId: User["_id"];
	tickets: OrderTicket[];
	eventId: Event["_id"];
	countOfTickets: number;
};

export type CreateOrderResponse = ItemResponse<'order', OrderDto>;
