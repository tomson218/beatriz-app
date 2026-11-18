import { catchAsync } from '../utils/catchAsync.ts';
import { listResponse } from '../utils/apiResponse.ts';
import { toOrderDto } from '../mappers/orderMapper.ts';
import { getAllOrders as findAllOrders, getOrdersOfUser } from '../services/orderService.ts';

export const getAllOrders = catchAsync(async (req, res) => {
	const orders = await findAllOrders();

	res.status(200).json(listResponse('orders', orders.map(toOrderDto)));
});

export const getUserOrders = catchAsync<{ id: string }>(async (req, res) => {
	const orders = await getOrdersOfUser(req.params.id);

	res.status(200).json(listResponse('orders', orders.map(toOrderDto)));
});
