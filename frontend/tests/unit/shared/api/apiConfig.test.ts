import { http, HttpResponse } from 'msw';
import type { AxiosError } from 'axios';
import instance from '@/shared/api/apiConfig';
import { getItemLocalStorage, setItemLocalStorage } from '@/shared/utils/localStorage';
import { apiUrl, server } from '../../../helpers/server';

/** Endpoint that records the Authorization header of every request. */
const recordAuthorizationHeaders = (respond: (authorization: string | null) => Response) => {
	const authorizationHeaders: (string | null)[] = [];

	server.use(
		http.get(apiUrl('/protected'), ({ request }) => {
			const authorization = request.headers.get('Authorization');
			authorizationHeaders.push(authorization);

			return respond(authorization);
		}),
	);

	return authorizationHeaders;
};

/** Sends a request that is expected to fail and returns the HTTP status of the error. */
const getRejectedStatus = async (request: Promise<unknown>): Promise<number | undefined> => {
	try {
		await request;
	} catch (error) {
		return (error as AxiosError).response?.status;
	}

	throw new Error('Expected the request to fail, but it succeeded.');
};

describe('apiConfig request interceptor', () => {
	it('sends the stored access token as a Bearer token', async () => {
		setItemLocalStorage('token', 'access-1');
		const headers = recordAuthorizationHeaders(() => HttpResponse.json({ ok: true }));

		await instance.get('/protected');
		const result = headers;
		const expected = ['Bearer access-1'];

		expect(result).toEqual(expected);
	});

	it('sends no Authorization header when the user is not logged in', async () => {
		const headers = recordAuthorizationHeaders(() => HttpResponse.json({ ok: true }));

		await instance.get('/protected');
		const result = headers;
		const expected = [null];

		expect(result).toEqual(expected);
	});
});

describe('apiConfig response interceptor (401 -> refresh token)', () => {
	it('refreshes the access token once and retries the request with it', async () => {
		setItemLocalStorage('token', 'expired-token');
		const headers = recordAuthorizationHeaders(authorization =>
			authorization === 'Bearer fresh-token'
				? HttpResponse.json({ data: 'secret' })
				: HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }),
		);
		server.use(
			http.post(apiUrl('/auth/refresh'), () => HttpResponse.json({ data: { accessToken: 'fresh-token' } })),
		);

		const response = await instance.get('/protected');
		const result = { data: response.data, headers, storedToken: getItemLocalStorage('token') };
		const expected = {
			data: { data: 'secret' },
			headers: ['Bearer expired-token', 'Bearer fresh-token'],
			storedToken: 'fresh-token',
		};

		expect(result).toEqual(expected);
	});

	it('does not send the expired access token to the refresh endpoint', async () => {
		setItemLocalStorage('token', 'expired-token');
		const refreshHeaders: (string | null)[] = [];
		recordAuthorizationHeaders(() => HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }));
		server.use(
			http.post(apiUrl('/auth/refresh'), ({ request }) => {
				refreshHeaders.push(request.headers.get('Authorization'));
				return HttpResponse.json({ message: 'No refresh token' }, { status: 401 });
			}),
		);

		await instance.get('/protected').catch(() => undefined);
		const result = refreshHeaders;
		const expected = [null];

		expect(result).toEqual(expected);
	});

	it('rejects with the original 401 when the refresh fails (no endless retry loop)', async () => {
		setItemLocalStorage('token', 'expired-token');
		const headers = recordAuthorizationHeaders(() =>
			HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }),
		);
		server.use(
			http.post(apiUrl('/auth/refresh'), () => HttpResponse.json({ message: 'Expired' }, { status: 401 })),
		);

		const status = await getRejectedStatus(instance.get('/protected'));
		const result = { status, attempts: headers.length };
		const expected = { status: 401, attempts: 1 };

		expect(result).toEqual(expected);
	});

	it('does not try to refresh for other errors', async () => {
		let refreshCalls = 0;
		recordAuthorizationHeaders(() => HttpResponse.json({ message: 'Forbidden' }, { status: 403 }));
		server.use(
			http.post(apiUrl('/auth/refresh'), () => {
				refreshCalls += 1;
				return HttpResponse.json({ data: { accessToken: 'fresh-token' } });
			}),
		);

		const status = await getRejectedStatus(instance.get('/protected'));
		const result = { status, refreshCalls };
		const expected = { status: 403, refreshCalls: 0 };

		expect(result).toEqual(expected);
	});
});
