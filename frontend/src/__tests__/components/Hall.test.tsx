import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Hall from '../../pages/Hall/Hall';
import { vi } from 'vitest';

const queryClient = new QueryClient();
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

vi.mock('../../api/queries/useGetEventByIdQuery', () => ({
	default: (eventId: string) => ({
		data: eventId ? { seatRequired: true, sectors: ['A', 'B'] } : null,
		isLoading: false,
	}),
}));

describe('HALL COMPONENT', () => {
	const setup = () => {
		return render(
			<MemoryRouter>
				<GoogleOAuthProvider clientId={googleClientId}>
					<QueryClientProvider client={queryClient}>
						<Hall />
					</QueryClientProvider>
				</GoogleOAuthProvider>
			</MemoryRouter>
		);
	};

	test('Renders Hall component with data', async () => {
		setup();

		await waitFor(() => {
			expect(screen.getByRole('heading', { name: 'Wybierz odpowiedni sektor hali' })).toBeInTheDocument();
		});
	});

	test('Click without selection', async () => {
		setup();

		await waitFor(() => {
			expect(screen.getByRole('heading', { name: 'Wybierz odpowiedni sektor hali' })).toBeInTheDocument();
		});

		const buttonElement = screen.getByText('Wybierz strefę');
		fireEvent.click(buttonElement);

		await waitFor(() => {
			expect(screen.getByText('Brak wybranego sektora hali!!!')).toBeInTheDocument();
		});
	});
});
