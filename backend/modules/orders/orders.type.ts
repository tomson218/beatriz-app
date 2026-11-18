// Kontrakt API współdzielony z frontendem: encje, DTO, requesty i response'y.
export type {
	CartTicket,
	CreateOrderResponse,
	Currency,
	GetAllOrdersResponse,
	Order,
	OrderDto,
	OrderIdParams,
	OrderRequest,
	OrderTicket,
	Seating,
} from '@beatriz/shared/orders';

export interface UserOrdersParams {
	id: string;
}
