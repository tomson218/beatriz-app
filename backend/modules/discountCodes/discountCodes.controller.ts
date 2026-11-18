import type { NextFunction, Request, Response } from 'express';
import { toDiscountCodeDto } from './discountCodes.mapper.ts';
import { applyDiscountCode as applyCode, createDiscountCode, findAllDiscountCodes } from './discountCodes.service.ts';
import type { ApplyDiscountCodeRequest, DiscountCodeDto, DiscountCodeRequest } from '@beatriz/shared/discountCodes';
import type { DiscountCodeDocument } from './discountCodes.type.ts';

export const getAllDiscountCodes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const discountCodes: DiscountCodeDocument[] = await findAllDiscountCodes();
		const discountCodesDto: DiscountCodeDto[] = discountCodes.map(toDiscountCodeDto);

		res.status(200).json({
			status: 'success',
			data: { results: discountCodesDto.length, discountCodes: discountCodesDto },
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
		const discount: number = await applyCode(String(req.user._id), enteredCode, totalPrice);

		res.status(200).json({ status: 'success', data: { discount } });
	} catch (error) {
		next(error);
	}
};

export const addDiscountCode = async (
	req: Request<{}, unknown, DiscountCodeRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const discountCode: DiscountCodeDocument = await createDiscountCode(req.body);
		const discountCodeDto: DiscountCodeDto = toDiscountCodeDto(discountCode);

		res.status(201).json({
			status: 'success',
			data: { newDiscountCode: discountCodeDto },
		});
	} catch (error) {
		next(error);
	}
};
