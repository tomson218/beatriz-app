import dotenv from 'dotenv';
import Stripe from 'stripe';
import { formattedDate, formattedTime } from '../utils/formattingDate.ts';
import UserModel from '../models/userModel.ts';
import { type Request, type Response, type NextFunction } from 'express';

dotenv.config({ path: './config.env' });

const stripe = new Stripe(process.env.STRIPE_SK);
const CLIENT_URL = 'http://localhost:5173';

export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { products } = req.body;

		const user = await UserModel.findById(req.user.id);

		if (user.cart.length > 0) {
			user.cart = [];
			await user.save();
		}

		user.cart = products;

		await user.save();

		const productsList = products.map(({ id, name, images, price, seating, sector, date, block }) => {
			const eventDate = new Date(date);

			return {
				price_data: {
					currency: 'pln',
					product_data: {
						name: `${name} - ${formattedDate(eventDate)} ${formattedTime(eventDate)}`,
						images: images,
						description: `sektor: ${sector} strefa: ${block} ${seating ? `miejsce: ${seating}` : ''}`,
					},
					unit_amount: price * 100,
				},
				quantity: 1,
			};
		});

		const session = await stripe.checkout.sessions.create({
			line_items: productsList,
			mode: 'payment',
			success_url: `${CLIENT_URL}/success`,
			cancel_url: `${CLIENT_URL}/cancel`,
			metadata: {
				userId: JSON.stringify(req.user.id),
				discountCode: JSON.stringify(req.body.discountCode),
			},
		});

		res.send({ url: session.url });
	} catch (err) {
		next(err);
	}
};
