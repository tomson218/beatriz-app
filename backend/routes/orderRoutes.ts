/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { protect } from '../controllers/authController.ts';
import { getAllOrders, getUserOrders } from '../controllers/orderController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router
	.route('/')

	.get(protect, getAllOrders);

router
	.route('/:id')

	.get(protect, getUserOrders);

export default router;
