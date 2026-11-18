/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import AppError from './utils/appError.ts';
import userRouter from './routes/userRoutes.ts';
import globalErrorHandler from './middleware/errorHandler.ts';
import cors from 'cors';
import eventRouter from './routes/eventRoutes.ts';
import paymentRoutes from './routes/paymentRoutes.ts';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ticketRoutes from './routes/ticketRoutes.ts';
import discountCodeRoutes from './routes/discountCodeRoutes.ts';
import forumRoutes from './routes/forumRoutes.ts';
import webhookRoutes from './routes/webhookRoutes.ts';
import orderRoutes from './routes/orderRoutes.ts';
import authRouter from './routes/authRoutes.ts';
import swaggerDocs from './swagger.ts';

const app: Express = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
	if (req.originalUrl.includes('/api/webhook')) {
		next();
	} else {
		express.json({ limit: '10mb' })(req, res, next);
	}
});

app.use((req: Request, res: Response, next: NextFunction): void => {
	req.requestTime = new Date().toISOString();
	next();
});

app.use('/api/v2/auth', authRouter);
app.use('/api/v2/users', userRouter);
app.use('/api/v2/events', eventRouter);
app.use('/api/v2/create-checkout-session', paymentRoutes);
app.use('/api/v2/webhook', webhookRoutes);
app.use('/api/v2/orders', orderRoutes);
app.use('/api/v2/tickets', ticketRoutes);
app.use('/api/v2/discount-codes', discountCodeRoutes);
app.use('/api/v2/forum', forumRoutes);

swaggerDocs(app);

app.all('*', (req: Request, res: Response, next: NextFunction): void => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
