import Login from '../../pages/Login/Login';
import Blocks from '../../pages/Blocks/Blocks';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
import { GoogleOAuthProvider } from '@react-oauth/google';
import Seats from '../../pages/Seats/Seats';
import OrderSummary from '../../pages/OrderSummary/OrderSummary';
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

describe('RENDERING COMPONENTS', () => {
	test('LOGIN', () => {
		render(
			<MemoryRouter>
				<GoogleOAuthProvider clientId={googleClientId}>
					<QueryClientProvider client={queryClient}>
						<Login />
					</QueryClientProvider>
				</GoogleOAuthProvider>
			</MemoryRouter>
		);

		expect(screen.getByRole('button', { name: 'Zaloguj się' })).toBeInTheDocument();

		expect(screen.getByText('Nie masz jeszcze konta?'));
	});

	test('SEATS', async () => {
		render(
			<MemoryRouter>
				<GoogleOAuthProvider clientId={googleClientId}>
					<QueryClientProvider client={queryClient}>
						<Seats />
					</QueryClientProvider>
				</GoogleOAuthProvider>
			</MemoryRouter>
		);

		waitFor(() => {
			expect(screen.getByRole('heading', { name: 'Wybierz miejsca dla sektora' })).toBeInTheDocument();
		});
	});

	test('BLOCKS', async () => {
		render(
			<MemoryRouter>
				<GoogleOAuthProvider clientId={googleClientId}>
					<QueryClientProvider client={queryClient}>
						<Blocks />
					</QueryClientProvider>
				</GoogleOAuthProvider>
			</MemoryRouter>
		);

		waitFor(() => {
			expect(screen.getByRole('heading', { name: 'Wybierz strefę' })).toBeInTheDocument();
		});
	});

	test('ORDER SUMMARY', async () => {
		render(
			<MemoryRouter>
				<GoogleOAuthProvider clientId={googleClientId}>
					<QueryClientProvider client={queryClient}>
						<OrderSummary />
					</QueryClientProvider>
				</GoogleOAuthProvider>
			</MemoryRouter>
		);

		waitFor(() => {
			expect(screen.getByRole('heading', { name: 'Podsumowanie Zamówienia' })).toBeInTheDocument();
		});
	});

	test('FAQ', async () => {
		render(
			<MemoryRouter>
				<GoogleOAuthProvider clientId={googleClientId}>
					<QueryClientProvider client={queryClient}>
						<OrderSummary />
					</QueryClientProvider>
				</GoogleOAuthProvider>
			</MemoryRouter>
		);

		waitFor(() => {
			expect(screen.getByRole('heading', { name: 'Sekcja FAQ' })).toBeInTheDocument();
		});
	});
});
