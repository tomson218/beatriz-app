import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import Hall from '@/features/tickets/pages/Hall/Hall';
import { renderWithProviders } from '../../../../helpers/render';
import { apiUrl, server } from '../../../../helpers/server';

const renderHall = () => {
	server.use(
		http.get(apiUrl('/events/event-1'), () =>
			HttpResponse.json({ data: { event: { _id: 'event-1', sectors: ['A', 'B'] } } }),
		),
	);

	return renderWithProviders(<Hall />, { route: '/hall?eventId=event-1' });
};

describe('Hall page', () => {
	it('shows the hall once the event is loaded', async () => {
		renderHall();

		const result = await screen.findByRole('heading', { name: 'Wybierz odpowiedni sektor hali' });

		expect(result).toBeInTheDocument();
	});

	it('selects an available sector, remembers it and updates the URL', async () => {
		const { user } = renderHall();

		await user.click(await screen.findByText('A'));
		const result = {
			info: screen.getByText('Wybrany sektor:').textContent,
			location: screen.getByTestId('location').textContent,
			storedSector: localStorage.getItem('sector'),
		};
		const expected = { info: 'Wybrany sektor: A', location: '/hall?eventId=event-1&sector=A', storedSector: 'A' };

		expect(result).toEqual(expected);
	});

	it('ignores clicks on sectors that are not available for the event', async () => {
		const { user } = renderHall();

		await user.click(await screen.findByText('C'));
		const result = screen.getByText('Nie wybrano jeszcze sektora');

		expect(result).toBeInTheDocument();
		expect(localStorage.getItem('sector')).toBeNull();
	});

	it('warns when the user tries to continue without choosing a sector', async () => {
		const { user } = renderHall();

		await user.click(await screen.findByRole('button', { name: 'Wybierz strefę' }));
		const result = await screen.findByRole('dialog', { name: 'Brak wybranego sektora hali!!!' });

		expect(result).toBeInTheDocument();
	});

	it('goes to the zone selection for the chosen sector', async () => {
		const { user } = renderHall();

		await user.click(await screen.findByText('B'));
		await user.click(screen.getByRole('button', { name: 'Wybierz strefę' }));
		const result = screen.getByTestId('location').textContent;
		const expected = '/blocks?eventId=event-1&sector=B';

		expect(result).toBe(expected);
	});
});
