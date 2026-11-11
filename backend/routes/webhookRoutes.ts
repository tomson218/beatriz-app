import express from 'express';
import { listenWebhook } from '../controllers/webhookController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router
	.route('/')

	.post(express.raw({ type: 'application/json' }), listenWebhook);

export default router;
