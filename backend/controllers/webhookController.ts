import dotenv from 'dotenv';
import Stripe from 'stripe';
import OrderModel from '../models/orderModel.ts';
import TicketModel from '../models/ticketModel.ts';
import { sendEmail } from '../utils/email.ts';
import UserModel from '../models/userModel.ts';
import { generatePDF } from '../utils/pdfGenerator.ts';
import { type Request, type Response, type NextFunction } from 'express';

dotenv.config({ path: './config.env' });

const stripe = new Stripe(process.env.STRIPE_SK);

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

export const listenWebhook = async (request: Request, response: Response, next: NextFunction) => {
	const sig = request.headers['stripe-signature'];

	let event;

	try {
		event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
	} catch (err) {
		response.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	switch (event.type) {
		case 'checkout.session.completed':
			try {
				const checkoutSessionCompleted = event.data.object;

				const user = await UserModel.findById(JSON.parse(checkoutSessionCompleted.metadata.userId));

				const discountCode = JSON.parse(checkoutSessionCompleted.metadata.discountCode);

				const appliedDiscount = user.appliedDiscountCodes.find(item => item.code === discountCode);

				if (appliedDiscount) {
					appliedDiscount.isUsed = true;
					await user.save();
				}

				const userCart = user.cart;

				const orderPrice = userCart.reduce((a, b) => a + Number(b.price), 0);

				const order = await OrderModel.create({
					totalAmount: orderPrice,
					date: new Date(),
					user: user._id,
					currency: 'PLN',
					tickets: userCart,
					countOfTickets: userCart.length,
				});

				const tickets = userCart.map(ticket => ({
					event: ticket.eventId,
					type: ticket.type,
					price: ticket.price,
					quantity: Number(1),
					seating: {
						sector: ticket.sector,
						block: ticket.block,
						seat: ticket.seating !== '' ? ticket.seating : undefined,
					},
					user: user._id,
					date: new Date(),
				}));

				await Promise.all(tickets.map(ticket => TicketModel.create(ticket)));

				const message = `<p>Dziękujęmy za złożenie zamówienia na kwotę ${order.totalAmount} ${order.currency}. W załączniku znajduje się plik bilety.pdf, który zawiera listę zakupionych biletów oraz szczegóły dotyczące wydarzenia.</p> <p>Pozdrawiamy</p> <p>Zespół aplikacji Beatriz App</p>`;

				const { email } = await UserModel.findById(user._id).select('email');

				const pdfContent = await generatePDF(userCart);

				try {
					await sendEmail({
						email: email,
						subject: 'Złożenie zamówienia',
						html: message,
						attachments: [
							{
								filename: 'bilety.pdf',
								content: pdfContent,
								contentType: 'application/pdf',
							},
						],
					});
				} catch (err) {
					return next(new AppError('Problem with sending an email.', 500));
				}

				await UserModel.findByIdAndUpdate(user._id, { cart: [] });
			} catch (error) {
				console.error('Error handling checkout.session.completed:', error);
			}
			break;

		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	response.send();
};
