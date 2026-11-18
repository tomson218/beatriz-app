import OrderModel from './orders.model.ts';
import type { Order, OrderTicket } from './orders.type.ts';

export const getAllOrders = async (): Promise<Order[]> => {
	return OrderModel.find().select('-__v');
};

export const getOrdersOfUser = async (userId: string): Promise<Order[]> => {
	return OrderModel.find({ userId }).select('-__v').populate<{ tickets: OrderTicket[] }>('tickets.event').sort({ date: -1 }).exec();
};
