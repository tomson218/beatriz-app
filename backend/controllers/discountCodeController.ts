import DiscountCodeModel, { type DiscountCode } from '../models/discountCodeModel.ts';
import UserModel from '../models/userModel.ts';
import { type Request, type Response, type NextFunction } from 'express';
import type { DiscountCodeDto } from '../types/discountCodes.ts';
import { toDiscountCodeDto } from '../mappers/discountCodeMapper.ts';

export const getAllDiscountCodes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const discountCodes: DiscountCode[] = await DiscountCodeModel.find().select('-__v');

		const discountCodesDto: DiscountCodeDto[] = discountCodes.map((d: DiscountCode) => toDiscountCodeDto(d));

		res.status(200).json({
			status: 'success',
			results: discountCodesDto.length,
			discountCodes: discountCodesDto,
		});
	} catch (err) {
		next(err);
	}
};

export const applyDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const currentDate = Date.now();
		const { enteredCode, totalAmount } = req.body;
		const user = await UserModel.findById(req.user.id);

		if (!user) {
			return res.status(404).json({
				status: 'fail',
				message: 'User not found.',
			});
		}

		const discountCode: DiscountCode | null = await DiscountCodeModel.findOne({ code: enteredCode });

		if (!discountCode) {
			return res.status(404).json({
				status: 'fail',
				message: 'Discount code not found.',
			});
		} else if (currentDate > discountCode.expiration) {
			// jakas tam funkcja
			return res.status(400).json({
				status: 'fail',
				message: 'Discount code has expired.',
			});
		} else if (totalAmount < discountCode.usageConditions) {
			// jakas tam funkcja z tego warnuku
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
			discount, // check!!!!!!!!!!!
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong',
		});
	}
};

export const addDiscountCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		console.log(req.body);

		const { code, value, expiration, usageLimit, usageConditions } = req.body;

		const newDiscountCode: DiscountCode = await DiscountCodeModel.create({
			code,
			value,
			expiration,
			usageLimit,
			usageConditions,
		});

		const newDiscountCodeDto: DiscountCodeDto = toDiscountCodeDto(newDiscountCode);

		res.status(200).json({
			status: 'success',
			newDiscountCode: newDiscountCodeDto, // tu na pewno nie bedzie id???/
		});
	} catch (err) {
		next(err);
	}
};
