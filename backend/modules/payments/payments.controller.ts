import type { NextFunction, Request, Response } from 'express';
import { createCheckoutSession as createSession } from './payments.service.ts';

export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const url = await createSession(req.user, req.body);

		res.status(201).json({ url });
	} catch (error) {
		next(error);
	}
};
