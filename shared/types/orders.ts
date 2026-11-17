import type { SuccessItem, SuccessList } from '@/types/common';
import type { Event } from '@/types/events';
import type { BlockType, TicketType } from '@/types/tickets';
import type { User } from '@/types/users';
import { Types, type InferSchemaType } from 'mongoose';
import { orderSchema } from '@/schemas/orderSchema';
import { CURRENCIES } from '@/enums/currencies';

export type Order = InferSchemaType<typeof orderSchema> & { _id: Types.ObjectId };
export type Currency = (typeof CURRENCIES)[number];

export interface Seating {
	sector: string;
	block: BlockType;
	seat: number;
}

export interface OrderTicket {
	eventId: Event | Event["_id"];
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

export type GetAllOrdersResponse = SuccessList<OrderDto>;

export type OrderRequest = Pick<Order, 'totalAmount' | 'currency'> & {
	user: User["_id"];
	tickets: OrderTicket[];
	event: Event["_id"];
	countOfTickets: number;
};

export type CreateOrderResponse = SuccessItem<OrderDto>;
