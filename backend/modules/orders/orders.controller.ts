import type { NextFunction, Request, Response } from 'express';
import { toOrderDto } from './orders.mapper.ts';
import { getAllOrders as findAllOrders, getOrdersOfUser } from './orders.service.ts';
import type { UserOrdersParams } from './orders.type.ts';

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const orders = await findAllOrders();

		res.status(200).json({
			status: 'success',
			data: { results: orders.length, orders: orders.map(toOrderDto) },
		});
	} catch (error) {
		next(error);
	}
};

export const getUserOrders = async (req: Request<UserOrdersParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const orders = await getOrdersOfUser(req.params.id);

		res.status(200).json({
			status: 'success',
			data: { results: orders.length, orders: orders.map(toOrderDto) },
		});
	} catch (error) {
		next(error);
	}
};
