import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import Login from '@/features/auth/pages/Login/Login';
import { getItemLocalStorage } from '@/shared/utils/localStorage';
import { renderWithProviders } from '../../../../helpers/render';
import { apiUrl, server } from '../../../../helpers/server';

const fillAndSubmit = async (user: ReturnType<typeof renderWithProviders>['user'], email: string, password: string) => {
	await user.type(screen.getByLabelText('Email'), email);
	await user.type(screen.getByLabelText('Hasło'), password);
	await user.click(screen.getByRole('button', { name: 'Zaloguj się' }));
};

describe('Login page', () => {
	beforeEach(() => {
		vi.spyOn(console, 'log').mockImplementation(() => {});
	});

	it('shows validation errors when the form is submitted empty', async () => {
		const { user } = renderWithProviders(<Login />);

		await user.click(screen.getByRole('button', { name: 'Zaloguj się' }));
		const result = [await screen.findByText('Email is required'), screen.getByText('Hasło jest wymagane')];

		result.forEach(message => expect(message).toBeInTheDocument());
	});

	it('requires a password of at least 8 characters', async () => {
		const { user } = renderWithProviders(<Login />);

		await fillAndSubmit(user, 'jan@example.com', 'short');
		const result = await screen.findByText('Hasło musi składać się z co najmniej 8 znaków');

		expect(result).toBeInTheDocument();
	});

	it('logs the user in and stores the access token and user id', async () => {
		let requestBody: unknown;
		server.use(
			http.post(apiUrl('/auth/login'), async ({ request }) => {
				requestBody = await request.json();
				return HttpResponse.json({
					status: 'success',
					data: { accessToken: 'access-1', user: { _id: 'user-1' } },
				});
			}),
		);
		const { user } = renderWithProviders(<Login />);

		await fillAndSubmit(user, 'jan@example.com', 'secret-password');
		await screen.findByText('Pomyślnie zalogowano się');
		const result = { requestBody, token: getItemLocalStorage('token'), userId: getItemLocalStorage('user-id') };
		const expected = {
			requestBody: { email: 'jan@example.com', password: 'secret-password' },
			token: 'access-1',
			userId: 'user-1',
		};

		expect(result).toEqual(expected);
	});

	it('shows an error and stores nothing when the credentials are wrong', async () => {
		server.use(
			http.post(apiUrl('/auth/login'), () =>
				HttpResponse.json({ status: 'fail', message: 'Incorrect email or password' }, { status: 401 }),
			),
		);
		const { user } = renderWithProviders(<Login />);

		await fillAndSubmit(user, 'jan@example.com', 'wrong-password');
		await screen.findByText('Logowanie nie powiodło się');
		const result = getItemLocalStorage('token');

		expect(result).toBeNull();
	});

	it('links to the sign-up page', () => {
		renderWithProviders(<Login />);

		const result = screen.getByRole('link', { name: 'Utwórz swoje konto' }).getAttribute('href');
		const expected = '/register';

		expect(result).toBe(expected);
	});
});
