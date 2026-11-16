import type { SuccessItem, SuccessList } from '@/common';
import type { Event } from '@/events';
import type { BlockType, TicketType } from '@/tickets';
import type { User, UserIdParams } from '@/users';

export type Currency = 'USD' | 'EUR' | 'PLN';

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

export interface Order {
	_id: string;
	totalAmount: number;
	date: string | Date;
	user: User["_id"];
	currency: Currency;
	tickets: OrderTicket[];
	event: Event | Event["_id"];
	countOfTickets: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface OrderDto extends Omit<Order, '_id'> {
	_id: string;
}

export interface OrderIdParams {
	orderId: Order["_id"];
}

export type GetAllOrdersResponse = SuccessList<OrderDto>;

export type GetUserOrdersResponse = GetAllOrdersResponse;

export type GetUserOrderParams = UserIdParams;

export interface CreateOrderRequest {
	totalAmount: number;
	user: User["_id"];
	currency: Currency;
	tickets: OrderTicket[];
	event: Event["_id"];
	countOfTickets: number;
}

export type CreateOrderResponse = SuccessItem<OrderDto>;
