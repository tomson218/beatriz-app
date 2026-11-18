/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import userRouter from './modules/users/users.routes.ts';
import cors from 'cors';
import eventRouter from './modules/events/events.routes.ts';
import paymentRoutes from './modules/payments/payments.routes.ts';
import path from 'path';
import ticketRoutes from './modules/tickets/tickets.routes.ts';
import discountCodeRoutes from './modules/discountCodes/discountCodes.routes.ts';
import postRoutes from './modules/posts/posts.routes.ts';
import webhookRoutes from './modules/webhooks/webhooks.routes.ts';
import orderRoutes from './modules/orders/orders.routes.ts';
import authRouter from './modules/auth/auth.routes.ts';
import swaggerDocs from './swagger.ts';

const app: Express = express();

const allowedOrigins = (process.env.CLIENT_URL ?? 'http://localhost:5173')
	.split(',')
	.map(origin => origin.trim())
	.filter(Boolean);

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
	helmet({
		contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
		xPoweredBy: false,
	}),
);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
				return;
			}

			callback(new Error('Not allowed by CORS'));
		},
		credentials: true,
	}),
);

// Zdjęcia wydarzeń i użytkowników (public/images). Helmet domyślnie ustawia `Cross-Origin-Resource-Policy: same-origin`,
// co blokuje ładowanie obrazków przez frontend działający na innym originie, więc dla plików statycznych zezwalamy na `cross-origin`.
app.use(
	express.static(path.join(import.meta.dirname, 'public'), {
		setHeaders: res => res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'),
	}),
);

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		status: 'fail',
		message: 'Too many requests. Please try again later.',
	},
});

app.use('/api/v2/auth', authLimiter);

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req: Request, res: Response, next: NextFunction): void => {
	if (req.originalUrl.startsWith('/api/v2/webhooks')) {
		next();
	} else {
		express.json({ limit: '10mb' })(req, res, next);
	}
});

app.use('/api/v2/auth', authRouter);
app.use('/api/v2/users', userRouter);
app.use('/api/v2/events', eventRouter);
app.use('/api/v2/checkout-sessions', paymentRoutes);
app.use('/api/v2/webhooks/stripe', webhookRoutes);
app.use('/api/v2/orders', orderRoutes);
app.use('/api/v2/tickets', ticketRoutes);
app.use('/api/v2/discount-codes', discountCodeRoutes);
app.use('/api/v2/posts', postRoutes);

swaggerDocs(app);

//app.use(globalErrorHandler);

export default app;
