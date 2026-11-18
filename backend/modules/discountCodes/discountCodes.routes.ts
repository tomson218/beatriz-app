/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { getAllDiscountCodes, addDiscountCode, applyDiscountCode } from './discountCodes.controller.ts';
import { protect, restrictTo } from '../../shared/middleware/authMiddleware.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router
	.route('/')
	.get(protect, restrictTo('admin'), getAllDiscountCodes)
	.post(protect, restrictTo('admin'), addDiscountCode);

router.post('/apply', protect, applyDiscountCode);

export default router;
