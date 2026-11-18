import { catchAsync } from '../utils/catchAsync.ts';
import { createCheckoutSession as createSession } from '../services/paymentService.ts';

export const createCheckoutSession = catchAsync(async (req, res) => {
	const url = await createSession(req.user, req.body);

	res.send({ url });
});
