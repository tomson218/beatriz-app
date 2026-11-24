import type { NextFunction, Request, Response } from 'express';

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

/** Odrzuca identyfikator w złym formacie statusem 400. Podpinać przez `router.param`. */
export const validateObjectId = (
	req: Request,
	res: Response,
	next: NextFunction,
	value: string,
	name: string,
): void => {
	if (OBJECT_ID_REGEX.test(value)) {
		next();
		return;
	}

	next(Object.assign(new Error(`Invalid ${name}: ${value}`), { statusCode: 400 }));
};
