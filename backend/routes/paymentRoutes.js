import express from 'express';
import { createCheckoutSession } from '../controllers/paymentController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router
	.route('/')

	.post(protect, createCheckoutSession);

export default router;
