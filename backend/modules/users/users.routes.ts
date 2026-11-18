/*

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express, { type NextFunction, type Request, type Response } from 'express';
import {
	getAllUsers,
	getUser,
	updateMe,
	deleteMe,
	getUserFavoriteEvents,
	addEventToFavourite,
	removeEventFromFavourite,
	replaceCart,
	updateUser,
	deleteUser,
} from './users.controller.ts';
import { getUserOrders } from '../orders/orders.controller.ts';
import { getUserTickets } from '../tickets/tickets.controller.ts';
import { protect, restrictTo, restrictToSelfOr } from '../../shared/middleware/authMiddleware.ts';
import { validateObjectId } from '../../shared/middleware/validateObjectId.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router.param('id', validateObjectId);
router.param('eventId', validateObjectId);

/** Pozwala trasom `/me` korzystać z handlerów opartych na parametrze `:id`. */
const setCurrentUserId = (req: Request, res: Response, next: NextFunction): void => {
	req.params.id = String(req.user.id);
	next();
};

router.get('/', protect, restrictTo('admin'), getAllUsers);

router
	.route('/me')
	.get(protect, setCurrentUserId, getUser)
	.patch(protect, updateMe)
	.delete(protect, deleteMe);

router.put('/me/cart', protect, replaceCart);

router
	.route('/me/favourites')
	.get(protect, getUserFavoriteEvents)
	.post(protect, addEventToFavourite);

router.delete('/me/favourites/:eventId', protect, removeEventFromFavourite);

router.get('/me/orders', protect, setCurrentUserId, getUserOrders);
router.get('/me/tickets', protect, setCurrentUserId, getUserTickets);

router
	.route('/:id')
	.get(protect, restrictToSelfOr('admin'), getUser)
	.patch(protect, restrictTo('admin'), updateUser)
	.delete(protect, restrictTo('admin'), deleteUser);

router.get('/:id/orders', protect, restrictToSelfOr('admin'), getUserOrders);
router.get('/:id/tickets', protect, restrictToSelfOr('admin', 'worker'), getUserTickets);

export default router;
