import type { Order } from '../models/orderModel.ts';
import type { SuccessList, SuccessItem, ErrorResponse } from './users.ts';

export type OrderDto = Pick<Order, '_id' | 'totalAmount' | 'date' | 'user' | 'currency' | 'tickets' | 'countOfTickets'>;

export type GetAllOrdersResponse = SuccessList<'orders'> | ErrorResponse;

export type GetUserOrdersResponse = GetAllOrdersResponse;
