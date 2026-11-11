import OrderModel from '../models/orderModel.ts';
import { type Request, type Response, type NextFunction } from 'express';

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const orders = await OrderModel.find().select('-__v');

		res.status(200).json({
			status: 'success',
			results: orders.length,
			orders,
		});
	} catch (error) {
		next(error);
	}
};

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const orders = await OrderModel.find({ user: id })
			.select('-__v')
			.populate('tickets.eventId')
			.sort({ date: -1 })
			.exec();
		res.status(200).json({
			status: 'success',
			results: orders.length,
			orders,
		});
	} catch (error) {
		next(error);
	}
};
