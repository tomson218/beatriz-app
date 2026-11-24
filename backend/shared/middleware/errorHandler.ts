import type { NextFunction, Request, Response } from 'express';

/** Body of every error response: `fail` for client errors (4xx), `error` for server errors (5xx). */
export interface ErrorResponseBody {
	status: 'fail' | 'error';
	message: string;
	stack?: string;
}

interface HttpError {
	statusCode: number;
	message: string;
}

/** Fields that errors from the app and its libraries may carry. */
type KnownError = Error & {
	statusCode?: number;
	status?: number;
	code?: number | string;
	type?: string;
	path?: string;
	value?: unknown;
	keyValue?: Record<string, unknown>;
	errors?: Record<string, { message: string }>;
};

const GENERIC_SERVER_ERROR = 'Something went wrong. Please try again later.';

const isClientError = (statusCode: number): boolean => statusCode >= 400 && statusCode < 500;

/**
 * Translates an error into an HTTP status and a message safe to show to the client.
 * Each rule matches one kind of error; the first match wins and unknown errors become a 500.
 */
const ERROR_RULES: ((error: KnownError) => HttpError | undefined)[] = [
	// Invalid JSON in the request body (body-parser). Checked first: these errors also carry a `statusCode`,
	// but their raw parser messages (e.g. "Unexpected end of JSON input") are not meant for the client.
	error =>
		error.type === 'entity.parse.failed'
			? { statusCode: 400, message: 'The request body is not valid JSON.' }
			: undefined,
	error =>
		error.type === 'entity.too.large' ? { statusCode: 413, message: 'The request body is too large.' } : undefined,

	// Errors thrown by the services: `Object.assign(new Error(message), { statusCode })`.
	error => (error.statusCode ? { statusCode: error.statusCode, message: error.message } : undefined),

	// Mongoose: a value of the wrong type, e.g. an invalid ObjectId.
	error =>
		error.name === 'CastError'
			? { statusCode: 400, message: `Invalid ${error.path}: ${String(error.value)}` }
			: undefined,

	// Mongoose: schema validation failed; all messages are returned together.
	error =>
		error.name === 'ValidationError'
			? {
					statusCode: 400,
					message:
						Object.values(error.errors ?? {})
							.map(({ message }) => message)
							.join(' ') || error.message,
				}
			: undefined,

	// MongoDB: unique index violation, e.g. an email that is already registered.
	error =>
		error.code === 11000
			? {
					statusCode: 409,
					message: `${Object.keys(error.keyValue ?? {}).join(', ') || 'Value'} is already in use.`,
				}
			: undefined,

	// JWT verification failures that reach the handler.
	error =>
		error.name === 'TokenExpiredError'
			? { statusCode: 401, message: 'Your token has expired. Please log in again.' }
			: undefined,
	error =>
		error.name === 'JsonWebTokenError'
			? { statusCode: 401, message: 'Invalid token. Please log in again.' }
			: undefined,

	// File uploads (Multer), e.g. a file that is too large.
	error => (error.name === 'MulterError' ? { statusCode: 400, message: error.message } : undefined),
];

export const toHttpError = (error: unknown): HttpError => {
	const knownError = (error instanceof Error ? error : new Error(String(error))) as KnownError;
	const matched = ERROR_RULES.map(rule => rule(knownError)).find(Boolean);

	return matched ?? { statusCode: 500, message: GENERIC_SERVER_ERROR };
};

/** Answers requests to paths that no router handles with a JSON 404 (instead of Express's HTML page). */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
	next(Object.assign(new Error(`Can't find ${req.method} ${req.originalUrl} on this server.`), { statusCode: 404 }));
};

/**
 * Last middleware of the app: turns every error passed to `next(error)` into a JSON response.
 * Messages of server errors (5xx) are hidden in production so internal details never leak to the client.
 */
export const errorHandler = (error: unknown, _req: Request, res: Response, next: NextFunction): void => {
	if (res.headersSent) {
		next(error);
		return;
	}

	const { statusCode, message } = toHttpError(error);
	const isServerError = !isClientError(statusCode);
	const isProduction = process.env.NODE_ENV === 'production';

	if (isServerError) {
		console.error(error);
	}

	// In development a server error shows its real message and stack to make debugging easier.
	const debugDetails =
		!isProduction && isServerError && error instanceof Error ? { message: error.message, stack: error.stack } : {};

	const body: ErrorResponseBody = {
		status: isServerError ? 'error' : 'fail',
		message: isServerError && isProduction ? GENERIC_SERVER_ERROR : message,
		...debugDetails,
	};

	res.status(statusCode).json(body);
};
