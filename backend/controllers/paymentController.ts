import dotenv from 'dotenv';
import Stripe from 'stripe';
import { formattedDate, formattedTime } from '../utils/formattingDate.ts';
import UserModel from '../models/userModel.ts';
import EventModel from '../models/eventModel.ts';
import DiscountCodeModel from '../models/discountCodeModel.ts';
import AppError from '../utils/appError.ts';
import { type Request, type Response, type NextFunction } from 'express';
import {
	applyDiscount,
	parseRequestedTickets,
	priceTickets,
	toStripeAmount,
	type CheckoutEvent,
	type CheckoutItem,
} from '../utils/checkout.ts';

dotenv.config({ path: './.env.local' });

const stripe = new Stripe(process.env.STRIPE_SK);

export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		// Z żądania bierzemy tylko CO klient kupuje. Ceny i rabaty liczy serwer.
		const tickets = parseRequestedTickets(req.body.products);

		const eventIds = [...new Set(tickets.map(ticket => ticket.eventId))];
		const events = await EventModel.find({ _id: { $in: eventIds } })
			.select('name date prices sectors seatRequired')
			.lean();
		const eventsById = new Map<string, CheckoutEvent>(
			events.map(event => [event._id.toString(), event as unknown as CheckoutEvent]),
		);

		let items: CheckoutItem[] = priceTickets(tickets, eventsById);

		const discountCode = typeof req.body.discountCode === 'string' ? req.body.discountCode.trim() : '';

		if (discountCode) {
			const subtotal = items.reduce((sum, item) => sum + item.price, 0);
			const code = await DiscountCodeModel.findOne({ code: discountCode });

			if (!code) {
				throw new AppError('Discount code not found.', 404);
			}
			if (Date.now() > new Date(code.expiration).getTime()) {
				throw new AppError('Discount code has expired.', 400);
			}
			if (subtotal < code.usageConditions) {
				throw new AppError('Total amount does not meet the usage conditions.', 400);
			}
			if (req.user.appliedDiscountCodes?.some(item => item.code === discountCode && item.isUsed === true)) {
				throw new AppError('Discount code already applied.', 400);
			}

			items = applyDiscount(items, code.value);
		}

		// Zatwierdzony koszyk trafia do `myCart`, którego klient nie może zmienić (`cart` można nadpisać przez /users/addCart).
		// Webhook po opłaceniu zamówienia czyta bilety wyłącznie stąd.
		await UserModel.findByIdAndUpdate(req.user.id, { myCart: items });

		const lineItems = items.map(({ name, date, images, price, seating, sector, block }) => {
			const eventDate = new Date(date);

			return {
				price_data: {
					currency: 'pln',
					product_data: {
						name: `${name} - ${formattedDate(eventDate)} ${formattedTime(eventDate)}`,
						images: images.length > 0 ? images : undefined,
						description: `sektor: ${sector} strefa: ${block} ${seating ? `miejsce: ${seating}` : ''}`,
					},
					unit_amount: toStripeAmount(price),
				},
				quantity: 1,
			};
		});

		const session = await stripe.checkout.sessions.create({
			line_items: lineItems,
			mode: 'payment',
			success_url: `${process.env.CLIENT_URL}/success`,
			cancel_url: `${process.env.CLIENT_URL}/cancel`,
			metadata: {
				userId: JSON.stringify(req.user.id),
				discountCode: JSON.stringify(discountCode || null),
			},
		});

		res.send({ url: session.url });
	} catch (err) {
		next(err);
	}
};
