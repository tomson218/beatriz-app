import type { NextFunction, Request, Response } from 'express';
import type Stripe from 'stripe';
import { fulfillCheckoutSession } from '../payments/payments.service.ts';
import { stripe } from '../payments/payments.stripe.ts';

/** Odbiera zdarzenia Stripe: weryfikuje podpis (wymaga surowego body) i przekazuje opłacone sesje do realizacji. */
export const listenWebhook = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
	const signature = request.headers['stripe-signature'] as string;
	const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
	} catch (error) {
		response.status(400).send(`Webhook Error: ${(error as Error).message}`);
		return;
	}

	if (event.type === 'checkout.session.completed') {
		try {
			await fulfillCheckoutSession(event.data.object);
		} catch (error) {
			const isEmailError: boolean = (error as { statusCode?: number }).statusCode === 500;

			if (isEmailError) {
				next(error);
				return;
			}

			console.error('Error handling checkout.session.completed:', error);
		}
	} else {
		console.log(`Unhandled event type ${event.type}`);
	}

	response.send();
};
