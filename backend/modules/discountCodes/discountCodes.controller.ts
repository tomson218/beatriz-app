import type { NextFunction, Request, Response } from 'express';
import { toDiscountCodeDto } from './discountCodes.mapper.ts';
import {
	applyDiscountCode as applyCode,
	createDiscountCode,
	getAllDiscountCodes as findAllCodes,
} from './discountCodes.service.ts';
import type { ApplyDiscountCodeRequest, DiscountCodeDto } from './discountCodes.type.ts';

export const getAllDiscountCodes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const discountCodes = await findAllCodes();

		res.status(200).json({
			status: 'success',
			data: { results: discountCodes.length, discountCodes: discountCodes.map(toDiscountCodeDto) },
		});
	} catch (error) {
		next(error);
	}
};

export const applyDiscountCode = async (
	req: Request<{}, unknown, ApplyDiscountCodeRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { enteredCode, totalPrice } = req.body;
		const discount = await applyCode(req.user.id, enteredCode, totalPrice);

		res.status(200).json({ status: 'success', data: { discount } });
	} catch (error) {
		next(error);
	}
};

export const addDiscountCode = async (
	req: Request<{}, unknown, DiscountCodeDto>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const discountCode = await createDiscountCode(req.body);

		res.status(201).json({
			status: 'success',
			data: { newDiscountCode: toDiscountCodeDto(discountCode) },
		});
	} catch (error) {
		next(error);
	}
};
