import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../../app.ts';

/**
 * Integration tests: requests go through the real Express app (middleware, routers, error handler).
 * The cases below are rejected before any database access, so no MongoDB is needed.
 */
describe('error responses (JSON instead of HTML)', () => {
	it('answers an unknown path with a JSON 404', async () => {
		const response = await request(app).get('/api/v2/does-not-exist');

		const result = { status: response.status, type: response.type, body: response.body };
		const expected = {
			status: 404,
			type: 'application/json',
			body: { status: 'fail', message: "Can't find GET /api/v2/does-not-exist on this server." },
		};

		expect(result).toEqual(expected);
	});

	it('answers invalid JSON in the body with a JSON 400', async () => {
		const response = await request(app)
			.post('/api/v2/auth/login')
			.set('Content-Type', 'application/json')
			.send('{"email": ');

		const result = { status: response.status, body: response.body };
		const expected = { status: 400, body: { status: 'fail', message: 'The request body is not valid JSON.' } };

		expect(result).toEqual(expected);
	});

	it('answers a missing email or password with a JSON 400', async () => {
		const response = await request(app).post('/api/v2/auth/login').send({ email: 'jan@example.com' });

		const result = { status: response.status, body: response.body };
		const expected = { status: 400, body: { status: 'fail', message: 'Please provide email and password!' } };

		expect(result).toEqual(expected);
	});

	it('answers a protected endpoint without a token with a JSON 401', async () => {
		const response = await request(app).get('/api/v2/events');

		const result = { status: response.status, body: response.body };
		const expected = { status: 401, body: { status: 'fail', message: 'Access requires a login. Please log in.' } };

		expect(result).toEqual(expected);
	});

	it('answers a request from a foreign origin with a JSON 403', async () => {
		const response = await request(app).get('/api/v2/events').set('Origin', 'https://evil.example.com');

		const result = { status: response.status, body: response.body };
		const expected = { status: 403, body: { status: 'fail', message: 'Not allowed by CORS' } };

		expect(result).toEqual(expected);
	});

	it('never returns an HTML error page or a stack trace for client errors', async () => {
		const response = await request(app).delete('/api/v2/nothing-here');

		const result = { isHtml: response.type === 'text/html', hasStack: 'stack' in response.body };
		const expected = { isHtml: false, hasStack: false };

		expect(result).toEqual(expected);
	});
});
