import { catchAsync } from '../utils/catchAsync.ts';
import { itemResponse, listResponse } from '../utils/apiResponse.ts';
import { toDiscountCodeDto } from '../mappers/discountCodeMapper.ts';
import { applyDiscountCode as applyCode, createDiscountCode, getAllDiscountCodes as findAllCodes } from '../services/discountCodeService.ts';
import type { ApplyDiscountCodeRequest, DiscountCodeDto } from '@beatriz/shared/discountCodes';

export const getAllDiscountCodes = catchAsync(async (req, res) => {
	const discountCodes = await findAllCodes();

	res.status(200).json(listResponse('discountCodes', discountCodes.map(toDiscountCodeDto)));
});

export const applyDiscountCode = catchAsync<{}, ApplyDiscountCodeRequest>(async (req, res) => {
	const { enteredCode, totalPrice } = req.body;
	const discount = await applyCode(req.user.id, enteredCode, totalPrice);

	res.status(200).json({ status: 'success', data: { discount } });
});

export const addDiscountCode = catchAsync<{}, DiscountCodeDto>(async (req, res) => {
	const discountCode = await createDiscountCode(req.body);

	res.status(200).json(itemResponse('newDiscountCode', toDiscountCodeDto(discountCode)));
});
