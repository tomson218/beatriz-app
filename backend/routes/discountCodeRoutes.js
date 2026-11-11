import express from 'express';
import { getAllDiscountCodes, addDiscountCode, applyDiscountCode } from '../controllers/discountCodeController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router
	.route('/')

	.get(getAllDiscountCodes)

	.post(addDiscountCode);

router

	.route('/applyCode')

	.post(protect, applyDiscountCode);

export default router;
