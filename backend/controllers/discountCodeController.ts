import DiscountCode from '../models/discountCodeModel.ts';
import User from '../models/userModel.ts';
import express, { type Express, type Request, type Response, type NextFunction } from 'express';

export const getAllDiscountCodes = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const discountCodes = await DiscountCode.find().select('-__v');

		res.status(200).json({
			status: 'success',
			results: discountCodes.length,
			discountCodes,
		});
	} catch (err) {
		next(err);
	}
};

export const applyDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const currentDate = Date.now();
		const { enteredCode, totalAmount } = req.body;
		const user = await User.findById(req.user.id);

		if (!user) {
			return res.status(404).json({
				status: 'fail',
				message: 'User not found.',
			});
		}

		const discountCode = await DiscountCode.findOne({ code: enteredCode });

		if (!discountCode) {
			return res.status(404).json({
				status: 'fail',
				message: 'Discount code not found.',
			});
		} else if (currentDate > discountCode.expiration) {
			return res.status(400).json({
				status: 'fail',
				message: 'Discount code has expired.',
			});
		} else if (totalAmount < discountCode.usageConditions) {
			return res.status(400).json({
				status: 'fail',
				message: 'Total amount does not meet the usage conditions.',
			});
		}

		if (!user.appliedDiscountCodes) {
			user.appliedDiscountCodes = [];
		}

		const alreadyApplied = user.appliedDiscountCodes.some(
			item => item.code === enteredCode && item.isUsed === true,
		);

		if (alreadyApplied) {
			return res.status(400).json({
				status: 'fail',
				message: 'Discount code already applied.',
			});
		}

		user.appliedDiscountCodes.push({ isUsed: false, code: discountCode.code });
		await user.save();

		const discount = discountCode.value;

		res.status(200).json({
			status: 'success',
			discount,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong',
		});
	}
};

export const addDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(req.body);

		const { code, value, expirationDate, usageLimit, minAmountOrder } = req.body;

		const newDiscountCode = await DiscountCode.create({
			code,
			value,
			expiration: expirationDate,
			usageLimit,
			usageConditions: minAmountOrder,
		});

		res.status(200).json({
			status: 'success',
			newDiscountCode,
		});
	} catch (err) {
		next(err);
	}
};
