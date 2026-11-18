/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { listenWebhook } from './webhooks.controller.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router
	.route('/')

	.post(express.raw({ type: 'application/json' }), listenWebhook);

export default router;
