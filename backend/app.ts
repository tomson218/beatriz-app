/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import morgan from 'morgan';
import AppError from './utils/appError.ts';
import userRouter from './routes/userRoutes.ts';
import globalErrorHandler from './controllers/errorController.ts';
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

app.use(express.static(path.join(__dirname, 'public')));

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	}),
);

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

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

/* 

1) pomocncize schematy dla mongoose

2) endpointy w backendzie, robiąc sukcesywnie dokumnetację w Postmanie

3) w tym czasie ogarnąć typy, żeby wywalić te wszelkie any (req.body, req.params, req.query, res.locals, itp.)

4) dodać refresh tokeny


/ err: Error 

*/
