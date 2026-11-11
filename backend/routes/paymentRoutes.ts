import express from 'express';
import { createCheckoutSession } from '../controllers/paymentController.ts';
import { protect } from '../controllers/authController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router
	.route('/')

	.post(protect, createCheckoutSession);

export default router;
