import { type NextFunction, type Request, type Response } from 'express';
import AppError from '../utils/appError.ts';
import { fulfillCheckoutSession } from '../services/paymentService.ts';
import { stripe } from '../services/stripeClient.ts';

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

/** Odbiera zdarzenia Stripe: weryfikuje podpis (wymaga surowego body) i przekazuje opłacone sesje do realizacji. */
export const listenWebhook = async (request: Request, response: Response, next: NextFunction) => {
	const signature = request.headers['stripe-signature'];

	let event;

	try {
		event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
	} catch (err) {
		response.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	switch (event.type) {
		case 'checkout.session.completed':
			try {
				await fulfillCheckoutSession(event.data.object);
			} catch (error) {
				const isEmailError = error instanceof AppError;

				if (isEmailError) return next(error);

				console.error('Error handling checkout.session.completed:', error);
			}
			break;

		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	response.send();
};
