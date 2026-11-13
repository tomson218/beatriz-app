import OrderModel from '../models/orderModel.ts';
import { type Request, type Response, type NextFunction } from 'express';
import type { GetAllOrdersResponse, GetUserOrdersResponse, OrderDto } from '../types/orders.ts';
import { toOrderDto } from '../mappers/orderMapper.ts';
import type { Order } from '../models/orderModel.ts';

export const getAllOrders = async (
	req: Request,
	res: Response<GetAllOrdersResponse>,
	next: NextFunction,
): Promise<void> => {
	try {
		const orders = await OrderModel.find().select('-__v');

		const ordersDto: OrderDto[] = orders.map((o: Order) => toOrderDto(o));

		res.status(200).json({
			status: 'success',
			data: {
				results: ordersDto.length,
				orders: ordersDto,
			},
		});
	} catch (error) {
		next(error);
	}
};

export const getUserOrders = async (
	req: Request<{ id: Order['_id'] }>,
	res: Response<GetUserOrdersResponse>,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;

		const orders: Order[] = await OrderModel.find({ user: id })
			.select('-__v')
			.populate('tickets.eventId')
			.sort({ date: -1 })
			.exec();

		const ordersDto: OrderDto[] = orders.map((o: Order) => toOrderDto(o));

		res.status(200).json({
			status: 'success',
			data: {
				results: ordersDto.length,
				orders: ordersDto,
			},
		});
	} catch (error) {
		next(error);
	}
};
