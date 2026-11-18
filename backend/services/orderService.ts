import OrderModel from '../models/orderModel.ts';
import type { Order } from '@beatriz/shared/orders';

export const getAllOrders = async (): Promise<Order[]> => {
	return OrderModel.find().select('-__v');
};

export const getOrdersOfUser = async (userId: string): Promise<Order[]> => {
	return OrderModel.find({ user: userId }).select('-__v').populate('tickets.eventId').sort({ date: -1 }).exec();
};
