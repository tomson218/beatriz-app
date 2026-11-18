import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncHandler<TParams, TBody> = (req: Request<TParams, any, TBody>, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Opakowuje asynchroniczny kontroler tak, aby każdy błąd (rzucony wyjątek lub odrzucona obietnica)
 * trafiał do globalnego handlera błędów. Dzięki temu kontrolery nie potrzebują bloków `try/catch`.
 */
export const catchAsync = <TParams = Record<string, string>, TBody = any>(
	handler: AsyncHandler<TParams, TBody>,
): RequestHandler<TParams, any, TBody> => {
	return (req, res, next) => {
		handler(req, res, next).catch(next);
	};
};
