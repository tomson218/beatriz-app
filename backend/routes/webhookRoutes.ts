import express from 'express';
import { listenWebhook } from '../controllers/webhookController.ts';

const router = express.Router();

router
	.route('/')

	.post(express.raw({ type: 'application/json' }), listenWebhook);

export default router;
