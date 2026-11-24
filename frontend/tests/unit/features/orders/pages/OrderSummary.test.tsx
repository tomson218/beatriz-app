import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import OrderSummary from '@/features/orders/pages/OrderSummary/OrderSummary';
import { renderWithProviders } from '../../../../helpers/render';
import { apiUrl, server } from '../../../../helpers/server';

const CART = [
	{ eventId: 'event-1', sector: 'A', block: 'blue', seating: '1', price: 90, type: 'normal' },
	{ eventId: 'event-1', sector: 'A', block: 'blue', seating: '2', price: 45, type: 'child' },
];

const EVENT = {
	_id: 'event-1',
	name: 'Koncert',
	date: '2026-12-01T20:00:00.000Z',
	image: 'event-1.jpg',
	prices: { normal: 90, VIP: 270, child: 45 },
	sectors: ['A'],
	seatRequired: true,
};

const renderSummary = ({ discountCode }: { discountCode?: string } = {}) => {
	localStorage.setItem('ORDERS', JSON.stringify(CART));
	localStorage.setItem('totalPrice', JSON.stringify(135));
	if (discountCode) localStorage.setItem('code', JSON.stringify(discountCode));
	server.use(http.get(apiUrl('/events/event-1'), () => HttpResponse.json({ data: { event: EVENT } })));

	return renderWithProviders(
		<>
			<OrderSummary />
			<Toaster />
		</>,
		{ route: '/summary?eventId=event-1' },
	);
};

describe('OrderSummary page', () => {
	beforeEach(() => {
		vi.spyOn(console, 'log').mockImplementation(() => {});
	});

	it('shows the order total from the cart', async () => {
		renderSummary();

		await screen.findByRole('heading', { name: 'Podsumowanie Zamówienia' });
		const result = screen.getByText(/Łączna kwota do zapłaty/).textContent;
		const expected = 'Łączna kwota do zapłaty: 135.00 PLN';

		expect(result).toBe(expected);
	});

	it('places an offline order with the cart and the stored discount code, then opens the orders page', async () => {
		let requestBody: unknown;
		server.use(
			http.post(apiUrl('/orders'), async ({ request }) => {
				requestBody = await request.json();
				return HttpResponse.json({ status: 'success', data: { order: { _id: 'order-1' } } }, { status: 201 });
			}),
		);
		const { user } = renderSummary({ discountCode: 'PROMO20' });

		await user.click(await screen.findByRole('button', { name: 'Zapłać offline' }));
		await screen.findByText('Zamówienie czeka na potwierdzenie wpłaty');
		const result = {
			requestBody,
			location: screen.getByTestId('location').textContent,
			storedCode: localStorage.getItem('code'),
		};
		const expected = {
			requestBody: { products: CART, discountCode: 'PROMO20' },
			location: '/user-orders',
			storedCode: null,
		};

		expect(result).toEqual(expected);
	});

	it('tells the user when a seat was taken in the meantime', async () => {
		server.use(http.post(apiUrl('/orders'), () => HttpResponse.json({ status: 'fail' }, { status: 409 })));
		const { user } = renderSummary();

		await user.click(await screen.findByRole('button', { name: 'Zapłać offline' }));
		const result = await screen.findByText('Wybrane miejsce jest już zajęte');

		expect(result).toBeInTheDocument();
		expect(screen.getByTestId('location').textContent).toBe('/summary?eventId=event-1');
	});

	it('creates a Stripe checkout session with the cart (prices are recalculated by the server)', async () => {
		let requestBody: unknown;
		server.use(
			http.post(apiUrl('/checkout-sessions'), async ({ request }) => {
				requestBody = await request.json();
				return HttpResponse.json({ url: null });
			}),
		);
		const { user } = renderSummary();

		await user.click(await screen.findByRole('button', { name: 'Zapłać teraz' }));
		await vi.waitFor(() => expect(requestBody).toBeDefined());
		const result = requestBody;
		const expected = { products: CART };

		expect(result).toEqual(expected);
	});

	it('shows an error when the checkout session cannot be created', async () => {
		server.use(
			http.post(apiUrl('/checkout-sessions'), () => HttpResponse.json({ status: 'error' }, { status: 500 })),
		);
		const { user } = renderSummary();

		await user.click(await screen.findByRole('button', { name: 'Zapłać teraz' }));
		const result = await screen.findByText('Nieudane utworzenie sesji realizacji zakupu');

		expect(result).toBeInTheDocument();
	});
});
