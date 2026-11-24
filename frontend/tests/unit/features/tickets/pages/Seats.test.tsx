import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import Seats from '@/features/tickets/pages/Seats/Seats';
import { renderWithProviders } from '../../../../helpers/render';
import { apiUrl, server } from '../../../../helpers/server';

const SEATS_ROUTE = '/seats?eventId=event-1&sector=A&block=blue';

const renderSeats = (route = SEATS_ROUTE) => {
	server.use(
		http.get(apiUrl('/events/event-1/occupied-seats'), () =>
			HttpResponse.json({ data: { occupiedSeats: [2, 5] } }),
		),
	);

	return renderWithProviders(<Seats />, { route });
};

const seat = (number: number) =>
	screen.getByRole('button', { name: new RegExp(`^Miejsce ${number}( \\(zajęte\\))?$`) });

describe('Seats page', () => {
	it('shows 100 seats and disables the occupied ones', async () => {
		renderSeats();

		await screen.findByRole('heading', { name: /Wybierz miejsca/ });
		const result = {
			occupied: [seat(2).hasAttribute('disabled'), seat(5).hasAttribute('disabled')],
			free: seat(3).hasAttribute('disabled'),
		};
		const expected = { occupied: [true, true], free: false };

		expect(result).toEqual(expected);
		expect(screen.getAllByRole('button', { name: /^Miejsce \d+/ })).toHaveLength(100);
	});

	it('selects and deselects seats and keeps them in the URL', async () => {
		const { user } = renderSeats();
		await screen.findByRole('heading', { name: /Wybierz miejsca/ });

		await user.click(seat(7));
		await user.click(seat(3));
		await user.click(seat(10));
		await user.click(seat(7));
		const result = {
			pressed: [seat(3), seat(7), seat(10)].map(button => button.getAttribute('aria-pressed')),
			info: screen.getByText('Wybrano miejsca:').textContent,
			location: screen.getByTestId('location').textContent,
		};
		const expected = {
			pressed: ['true', 'false', 'true'],
			info: 'Wybrano miejsca: 3, 10',
			location: '/seats?eventId=event-1&sector=A&block=blue&seats=3,10',
		};

		expect(result).toEqual(expected);
	});

	it('restores selected seats from the URL', async () => {
		renderSeats(`${SEATS_ROUTE}&seats=4,9`);

		await screen.findByRole('heading', { name: /Wybierz miejsca/ });
		const result = screen.getByText('Wybrano miejsca:').textContent;
		const expected = 'Wybrano miejsca: 4, 9';

		expect(result).toBe(expected);
	});

	it('warns when the user tries to continue without choosing a seat', async () => {
		const { user } = renderSeats();

		await user.click(await screen.findByRole('button', { name: 'Przejdź do wyboru biletów' }));
		const result = await screen.findByRole('dialog', { name: 'Brak wybranego miejsca!!!' });

		expect(result).toBeInTheDocument();
	});

	it('goes to the ticket choice with the selected seats sorted', async () => {
		const { user } = renderSeats();
		await screen.findByRole('heading', { name: /Wybierz miejsca/ });

		await user.click(seat(12));
		await user.click(seat(4));
		await user.click(screen.getByRole('button', { name: 'Przejdź do wyboru biletów' }));
		const result = {
			location: screen.getByTestId('location').textContent,
			storedSeats: JSON.parse(localStorage.getItem('seats') ?? 'null'),
		};
		const expected = {
			location: '/ticket-choice?eventId=event-1&sector=A&block=blue&seats=4,12',
			storedSeats: [12, 4],
		};

		expect(result).toEqual(expected);
	});
});
