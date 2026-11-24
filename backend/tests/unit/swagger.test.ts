import { describe, expect, it } from 'vitest';
import { swaggerSpec } from '../../swagger.ts';

interface Operation {
	requestBody?: {
		content: Record<string, { example?: unknown; schema?: { properties?: Record<string, { example?: unknown }> } }>;
	};
	security?: unknown[];
}

const spec = swaggerSpec as { paths: Record<string, Record<string, Operation>> };

const operations = Object.entries(spec.paths).flatMap(([path, methods]) =>
	Object.entries(methods).map(([method, operation]) => ({
		id: `${method.toUpperCase()} ${path}`,
		method,
		path,
		operation,
	})),
);

/** Endpoints that send no body: the refresh token travels in a cookie, logout needs only the token, Stripe signs the webhook itself. */
const NO_BODY_ENDPOINTS = ['POST /api/v2/auth/refresh', 'POST /api/v2/auth/logout', 'POST /api/v2/webhooks/stripe'];

const PUBLIC_ENDPOINTS = [
	'POST /api/v2/auth/signup',
	'POST /api/v2/auth/login',
	'POST /api/v2/auth/refresh',
	'POST /api/v2/auth/google',
	'POST /api/v2/auth/facebook',
	'POST /api/v2/webhooks/stripe',
];

const hasExample = (operation: Operation): boolean =>
	Object.values(operation.requestBody?.content ?? {}).some(
		({ example, schema }) =>
			example !== undefined ||
			Object.values(schema?.properties ?? {}).some(property => property.example !== undefined),
	);

describe('swagger spec', () => {
	it('documents every endpoint under /api/v2', () => {
		const result = operations.filter(({ path }) => !path.startsWith('/api/v2/')).map(({ id }) => id);
		const expected: string[] = [];

		expect(result).toEqual(expected);
	});

	it('has a request body with a ready-to-send example for every endpoint that reads one', () => {
		const result = operations
			.filter(({ method, id }) => ['post', 'put', 'patch'].includes(method) && !NO_BODY_ENDPOINTS.includes(id))
			.filter(({ operation }) => !hasExample(operation))
			.map(({ id }) => id);
		const expected: string[] = [];

		expect(result).toEqual(expected);
	});

	it('requires the Bearer token on every endpoint except login, sign-up, refresh and the webhook', () => {
		const result = operations
			.filter(({ id, operation }) => !PUBLIC_ENDPOINTS.includes(id) && !operation.security)
			.map(({ id }) => id);
		const expected: string[] = [];

		expect(result).toEqual(expected);
	});
});
