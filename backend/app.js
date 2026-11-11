import express from 'express';
import morgan from 'morgan';
import AppError from './utils/appError.js';
import userRouter from './routes/userRoutes.js';
import globalErrorHandler from './controllers/errorController.js';
import cors from 'cors';
import eventRouter from './routes/eventRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ticketRoutes from './routes/ticketRoutes.js';
import discountCodeRoutes from './routes/discountCodeRoutes.js';
import forumRoutes from './routes/forumRoutes.js';

import webhookRoutes from './routes/webhookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import session from 'express-session';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);

app.use(
	session({
		secret: 'session-payment',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use((req, res, next) => {
	if (req.originalUrl.includes('/api/webhook')) {
		next();
	} else {
		express.json({ limit: '10mb' })(req, res, next);
	}
});

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

app.use('/api/users', userRouter);
app.use('/api/events', eventRouter);
app.use('/api/create-checkout-session', paymentRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/discount-codes', discountCodeRoutes);
app.use('/api/forum', forumRoutes);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
