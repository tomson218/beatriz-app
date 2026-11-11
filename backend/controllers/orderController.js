import Order from '../models/orderModel.js';

export const getAllOrders = async (req, res, next) => {
	try {
		const orders = await Order.find().select('-__v');

		res.status(200).json({
			status: 'success',
			results: orders.length,
			orders,
		});
	} catch (error) {
		next(error);
	}
};

export const getUserOrders = async (req, res, next) => {
	try {
		const { id } = req.params;

		const orders = await Order.find({ user: id })
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
