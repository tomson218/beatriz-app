import type { ItemResponse, ListResponse } from '#types/common';
import type { Event } from '#types/events';
import type { BlockType, TicketType } from '#types/tickets';
import type { User } from '#types/users';
import type { Types, InferSchemaType } from 'mongoose';
import type { orderSchema } from '#schemas/orderSchema';
import type { CURRENCIES } from '#enums/currencies';
import type { ORDER_STATUSES } from '#enums/orderStatuses';
import type { PAYMENT_METHODS } from '#enums/paymentMethods';
import type { CreateCheckoutSessionRequest } from '#types/payments';

/** `user`, `event` i `tickets[].event` to pola wirtualne: mają wartość tylko po `populate`. */
export type Order = Omit<InferSchemaType<typeof orderSchema>, 'tickets'> & {
	_id: Types.ObjectId;
	tickets: OrderTicket[];
	user?: User;
	event?: Event;
};
export type Currency = (typeof CURRENCIES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** `seat` jest puste dla biletów bez numerowanego miejsca. */
export interface Seating {
	sector?: string | null;
	block?: BlockType | null;
	seat?: number | null;
}

export interface OrderTicket {
	_id?: Types.ObjectId;
	eventId?: Event['_id'] | null;
	event?: Event;
	seating: Seating[];
	price?: number | null;
	type?: TicketType | null;
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
	/** Termin wpłaty: tylko dla zamówień offline czekających na wpłatę. */
	expiresAt?: Date;
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

/** Zamówienie opłacane poza systemem: bilety i kod rabatowy jak przy płatności online. */
export type CreateOfflineOrderRequest = CreateCheckoutSessionRequest;

/** Decyzja administratora o wpłacie offline. */
export interface UpdateOrderStatusRequest {
	status: Extract<OrderStatus, 'paid' | 'rejected'>;
}

export type UpdateOrderStatusResponse = ItemResponse<'order', OrderDto>;
