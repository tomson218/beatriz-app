import type { NextFunction, Request, Response } from 'express';
import { createCheckoutSession as createStripeSession } from './payments.service.ts';
import type { CreateCheckoutSessionRequest } from '@beatriz/shared/payments';

export const createCheckoutSession = async (
	req: Request<{}, unknown, CreateCheckoutSessionRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const url: string | null = await createStripeSession(req.user, req.body);

		res.status(201).json({ url });
	} catch (error) {
		next(error);
	}
};
