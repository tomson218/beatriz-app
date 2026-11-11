import express from 'express';
import { getAllDiscountCodes, addDiscountCode, applyDiscountCode } from '../controllers/discountCodeController.ts';
import { protect } from '../controllers/authController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router
	.route('/')

	.get(protect, getAllDiscountCodes)

	.post(protect, addDiscountCode);

router

	.route('/applyCode')

	.post(protect, applyDiscountCode);

export default router;
