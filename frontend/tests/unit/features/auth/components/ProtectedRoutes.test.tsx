import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import ProtectedRoutes from '@/features/auth/components/ProtectedRoutes/ProtectedRoutes';
import { setItemLocalStorage } from '@/shared/utils/localStorage';
import { renderWithProviders } from '../../../../helpers/render';
import { apiUrl, server } from '../../../../helpers/server';

const logIn = (role: 'user' | 'admin') => {
	setItemLocalStorage('token', 'access-token');
	setItemLocalStorage('user-id', 'user-1');
	server.use(http.get(apiUrl('/users/user-1'), () => HttpResponse.json({ data: { user: { _id: 'user-1', role } } })));
};

const renderProtectedPage = (isRequiredAdmin = false) =>
	renderWithProviders(
		<ProtectedRoutes isRequiredAdmin={isRequiredAdmin}>
			<h1>Secret page</h1>
		</ProtectedRoutes>,
		{ route: '/secret', path: '/secret' },
	);

/** Records the user ids the page asks the API for (a logged-out visitor produces `/users/null`). */
const recordUserRequests = () => {
	const requestedIds: string[] = [];

	server.use(
		http.get(apiUrl('/users/:id'), ({ params }) => {
			requestedIds.push(String(params.id));
			return HttpResponse.json({ status: 'fail' }, { status: 404 });
		}),
	);

	return requestedIds;
};

describe('ProtectedRoutes', () => {
	it('redirects a logged-out visitor to the login page', () => {
		recordUserRequests();
		renderProtectedPage();

		const result = screen.getByTestId('location').textContent;
		const expected = '/';

		expect(result).toBe(expected);
		expect(screen.queryByRole('heading', { name: 'Secret page' })).not.toBeInTheDocument();
	});

	// Regression test: `useGetUserByIdQuery` used to send `GET /users/null` for a logged-out visitor.
	it('does not ask the API for a user when nobody is logged in', async () => {
		const requestedIds = recordUserRequests();
		renderProtectedPage();

		await new Promise(resolve => setTimeout(resolve, 50));
		const result = requestedIds;
		const expected: string[] = [];

		expect(result).toEqual(expected);
	});

	it('shows a loading message while the user is being fetched', () => {
		logIn('user');
		renderProtectedPage();

		const result = screen.getByText('Ładowanie...');

		expect(result).toBeInTheDocument();
	});

	it('shows the page to a logged-in user', async () => {
		logIn('user');
		renderProtectedPage();

		const result = await screen.findByRole('heading', { name: 'Secret page' });

		expect(result).toBeInTheDocument();
	});

	it('redirects a regular user away from an admin-only page', async () => {
		logIn('user');
		renderProtectedPage(true);

		await screen.findByText('/home');
		const result = screen.getByTestId('location').textContent;
		const expected = '/home';

		expect(result).toBe(expected);
		expect(screen.queryByRole('heading', { name: 'Secret page' })).not.toBeInTheDocument();
	});

	it('shows an admin-only page to an admin', async () => {
		logIn('admin');
		renderProtectedPage(true);

		const result = await screen.findByRole('heading', { name: 'Secret page' });

		expect(result).toBeInTheDocument();
	});
});
