/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { getAllDiscountCodes, addDiscountCode, applyDiscountCode } from '../controllers/discountCodeController.ts';
import { protect, restrictTo } from '../middleware/authMiddleware.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router
	.route('/')

	.get(protect, restrictTo('admin'), getAllDiscountCodes)

	.post(protect, restrictTo('admin'), addDiscountCode);

router

	.route('/applyCode') // check

	.post(protect, applyDiscountCode);

export default router;
