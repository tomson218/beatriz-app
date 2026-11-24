import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { errorHandler, notFoundHandler, toHttpError } from '../../../../shared/middleware/errorHandler.ts';

const httpError = (message: string, statusCode: number) => Object.assign(new Error(message), { statusCode });
const namedError = (name: string, fields: Record<string, unknown> = {}) =>
	Object.assign(new Error(`${name} message`), { name, ...fields });

const mockResponse = (headersSent = false) => {
	const res = { headersSent, status: vi.fn(), json: vi.fn() };
	res.status.mockReturnValue(res);

	return res;
};

describe('toHttpError', () => {
	it.each([
		[
			'an app error with statusCode',
			httpError('No event found with that ID', 404),
			{ statusCode: 404, message: 'No event found with that ID' },
		],
		[
			'invalid JSON in the body',
			Object.assign(new SyntaxError('Unexpected token'), { type: 'entity.parse.failed' }),
			{ statusCode: 400, message: 'The request body is not valid JSON.' },
		],
		[
			'a body that is too large',
			Object.assign(new Error('too large'), { type: 'entity.too.large' }),
			{ statusCode: 413, message: 'The request body is too large.' },
		],
		[
			'a Mongoose CastError',
			namedError('CastError', { path: '_id', value: 'abc' }),
			{ statusCode: 400, message: 'Invalid _id: abc' },
		],
		[
			'a Mongoose ValidationError',
			namedError('ValidationError', {
				errors: {
					email: { message: 'Please provide a valid email.' },
					password: { message: 'Password is required.' },
				},
			}),
			{ statusCode: 400, message: 'Please provide a valid email. Password is required.' },
		],
		[
			'a duplicate key',
			Object.assign(new Error('E11000'), { code: 11000, keyValue: { email: 'jan@example.com' } }),
			{ statusCode: 409, message: 'email is already in use.' },
		],
		[
			'an expired JWT',
			namedError('TokenExpiredError'),
			{ statusCode: 401, message: 'Your token has expired. Please log in again.' },
		],
		[
			'an invalid JWT',
			namedError('JsonWebTokenError'),
			{ statusCode: 401, message: 'Invalid token. Please log in again.' },
		],
		['a Multer error', namedError('MulterError'), { statusCode: 400, message: 'MulterError message' }],
		[
			'an unknown error',
			new Error('db exploded'),
			{ statusCode: 500, message: 'Something went wrong. Please try again later.' },
		],
		[
			'a thrown non-error value',
			'boom',
			{ statusCode: 500, message: 'Something went wrong. Please try again later.' },
		],
	])('maps %s', (_label, error, expected) => {
		const result = toHttpError(error);

		expect(result).toEqual(expected);
	});
});

describe('errorHandler', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	const handle = (error: unknown, res = mockResponse()) => {
		const next = vi.fn();
		errorHandler(error, {} as Request, res as unknown as Response, next as NextFunction);

		return { res, next };
	};

	it('answers client errors with status "fail" and the error message', () => {
		const { res } = handle(httpError('Discount code has expired.', 400));

		const result = { status: res.status.mock.calls[0][0], body: res.json.mock.calls[0][0] };
		const expected = { status: 400, body: { status: 'fail', message: 'Discount code has expired.' } };

		expect(result).toEqual(expected);
		expect(console.error).not.toHaveBeenCalled();
	});

	it('hides the details of server errors in production and logs them', () => {
		vi.stubEnv('NODE_ENV', 'production');
		const error = new Error('Connection to MongoDB lost');

		const { res } = handle(error);
		const result = { status: res.status.mock.calls[0][0], body: res.json.mock.calls[0][0] };
		const expected = {
			status: 500,
			body: { status: 'error', message: 'Something went wrong. Please try again later.' },
		};

		expect(result).toEqual(expected);
		expect(console.error).toHaveBeenCalledWith(error);
	});

	it('shows the real message and stack of server errors outside production', () => {
		vi.stubEnv('NODE_ENV', 'development');
		const error = new Error('Connection to MongoDB lost');

		const { res } = handle(error);
		const result = res.json.mock.calls[0][0];
		const expected = { status: 'error', message: 'Connection to MongoDB lost', stack: error.stack };

		expect(result).toEqual(expected);
	});

	it('passes the error on when the response has already started', () => {
		const error = new Error('late failure');

		const { res, next } = handle(error, mockResponse(true));
		const result = next.mock.calls[0][0];

		expect(result).toBe(error);
		expect(res.json).not.toHaveBeenCalled();
	});
});

describe('notFoundHandler', () => {
	it('passes a 404 error naming the method and path', () => {
		const next = vi.fn();

		notFoundHandler({ method: 'GET', originalUrl: '/api/v2/nope' } as Request, {} as Response, next);
		const result = { statusCode: next.mock.calls[0][0].statusCode, message: next.mock.calls[0][0].message };
		const expected = { statusCode: 404, message: "Can't find GET /api/v2/nope on this server." };

		expect(result).toEqual(expected);
	});
});
