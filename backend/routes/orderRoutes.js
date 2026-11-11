import express from 'express';
import { protect } from './../controllers/authController.js';
import { getAllOrders, getUserOrders } from '../controllers/orderController.js';

const router = express.Router();

router
	.route('/')

	.get(protect, getAllOrders);

router
	.route('/:id')

	.get(protect, getUserOrders);

export default router;
