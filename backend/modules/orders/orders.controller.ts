import type { NextFunction, Request, Response } from 'express';
import { toOrderDto } from './orders.mapper.ts';
import {
	createOfflineOrder as createPendingOrder,
	findAllOrders,
	findOrdersOfUser,
	parseOrderDecision,
	parseOrderStatus,
	resolveOfflineOrder,
} from './orders.service.ts';
import type { CreateOfflineOrderRequest, OrderDto, OrderStatus, UpdateOrderStatusRequest } from '@beatriz/shared/orders';
import type { OrderDocument, OrderRouteParams } from './orders.type.ts';

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const status: OrderStatus | undefined = parseOrderStatus(req.query.status);
		const orders: OrderDocument[] = await findAllOrders(status);
		const ordersDto: OrderDto[] = orders.map(toOrderDto);

		res.status(200).json({
			status: 'success',
			data: { results: ordersDto.length, orders: ordersDto },
		});
	} catch (error) {
		next(error);
	}
};

export const getUserOrders = async (req: Request<OrderRouteParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const orders: OrderDocument[] = await findOrdersOfUser(req.params.id);
		const ordersDto: OrderDto[] = orders.map(toOrderDto);

		res.status(200).json({
			status: 'success',
			data: { results: ordersDto.length, orders: ordersDto },
		});
	} catch (error) {
		next(error);
	}
};

export const getMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const orders: OrderDocument[] = await findOrdersOfUser(String(req.user._id));
		const ordersDto: OrderDto[] = orders.map(toOrderDto);

		res.status(200).json({
			status: 'success',
			data: { results: ordersDto.length, orders: ordersDto },
		});
	} catch (error) {
		next(error);
	}
};

export const createOfflineOrder = async (
	req: Request<{}, unknown, CreateOfflineOrderRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const order: OrderDocument = await createPendingOrder(req.user, req.body);
		const orderDto: OrderDto = toOrderDto(order);

		res.status(201).json({
			status: 'success',
			data: { order: orderDto },
		});
	} catch (error) {
		next(error);
	}
};

export const updateOrderStatus = async (
	req: Request<OrderRouteParams, unknown, UpdateOrderStatusRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const decision: UpdateOrderStatusRequest['status'] = parseOrderDecision(req.body.status);
		const order: OrderDocument = await resolveOfflineOrder(req.params.id, decision);
		const orderDto: OrderDto = toOrderDto(order);

		res.status(200).json({
			status: 'success',
			data: { order: orderDto },
		});
	} catch (error) {
		next(error);
	}
};
