import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import DiscountCodeForm from '@/features/discountCodes/components/DiscountCodeForm/DiscountCodeForm';
import TotalAmount from '@/features/orders/components/TotalAmount/TotalAmount';
import { renderWithProviders } from '../../../../helpers/render';
import { apiUrl, server } from '../../../../helpers/server';

const CART = [
	{ eventId: 'event-1', sector: 'A', block: 'blue', seating: '1', price: 100, type: 'normal' },
	{ eventId: 'event-1', sector: 'A', block: 'blue', seating: '2', price: 50, type: 'child' },
];

const renderForm = () => {
	localStorage.setItem('ORDERS', JSON.stringify(CART));
	localStorage.setItem('totalPrice', JSON.stringify(150));

	return renderWithProviders(
		<>
			<DiscountCodeForm />
			<TotalAmount />
		</>,
	);
};

const applyCode = async (user: ReturnType<typeof renderWithProviders>['user'], code: string) => {
	await user.type(screen.getByLabelText('Podaj kod zniżkowy:'), code);
	await user.click(screen.getByRole('button', { name: 'Użyj kodu' }));
};

describe('DiscountCodeForm', () => {
	beforeEach(() => {
		vi.spyOn(console, 'log').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	it('sends the code with the current total to the API', async () => {
		let requestBody: unknown;
		server.use(
			http.post(apiUrl('/discount-codes/apply'), async ({ request }) => {
				requestBody = await request.json();
				return HttpResponse.json({ status: 'success', data: { discount: 0.2 } });
			}),
		);
		const { user } = renderForm();

		await applyCode(user, '  PROMO20 ');
		await screen.findByText('Łączna kwota do zapłaty: 120.00 PLN');
		const result = requestBody;
		const expected = { enteredCode: 'PROMO20', totalPrice: 150 };

		expect(result).toEqual(expected);
	});

	it('lowers every ticket price and the total, and remembers the code', async () => {
		server.use(
			http.post(apiUrl('/discount-codes/apply'), () =>
				HttpResponse.json({ status: 'success', data: { discount: 0.2 } }),
			),
		);
		const { user } = renderForm();

		await applyCode(user, 'PROMO20');
		await screen.findByText('Łączna kwota do zapłaty: 120.00 PLN');
		const result = {
			prices: JSON.parse(localStorage.getItem('ORDERS') ?? '[]').map((ticket: { price: number }) => ticket.price),
			totalPrice: JSON.parse(localStorage.getItem('totalPrice') ?? 'null'),
			code: JSON.parse(localStorage.getItem('code') ?? 'null'),
		};
		const expected = { prices: [80, 40], totalPrice: 120, code: 'PROMO20' };

		expect(result).toEqual(expected);
	});

	it.each([
		[409, 'Kod zniżkowy został już użyty'],
		[400, 'Użyty kod jest już nieważny albo wartość zamówienia jest za mała, żeby skorzystać z tego kodu'],
		[404, 'Użyty kod jest niepoprawny'],
	])('shows the right message for HTTP %s and keeps the prices', async (status, expected) => {
		server.use(http.post(apiUrl('/discount-codes/apply'), () => HttpResponse.json({ status: 'fail' }, { status })));
		const { user } = renderForm();

		await applyCode(user, 'BADCODE');
		const result = (await screen.findByText(expected)).textContent;

		expect(result).toBe(expected);
		expect(screen.getByText('Łączna kwota do zapłaty: 150.00 PLN')).toBeInTheDocument();
		expect(localStorage.getItem('code')).toBeNull();
	});
});
