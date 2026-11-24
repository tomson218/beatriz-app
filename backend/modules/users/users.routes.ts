/*

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import {
	getAllUsers,
	getMe,
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
import { getMyOrders, getUserOrders } from '../orders/orders.controller.ts';
import { getMyTickets, getUserTickets } from '../tickets/tickets.controller.ts';
import { protect, restrictTo, restrictToSelfOr } from '../../shared/middleware/authMiddleware.ts';
import { validateObjectId } from '../../shared/middleware/validateObjectId.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router.param('id', validateObjectId);
router.param('eventId', validateObjectId);

router.get('/', protect, restrictTo('admin'), getAllUsers);

router.route('/me').get(protect, getMe).patch(protect, updateMe).delete(protect, deleteMe);

router.put('/me/cart', protect, replaceCart);

router.route('/me/favourites').get(protect, getUserFavoriteEvents).post(protect, addEventToFavourite);

router.route('/me/favourites/:eventId').delete(protect, removeEventFromFavourite);

router.get('/me/orders', protect, getMyOrders);
router.get('/me/tickets', protect, getMyTickets);

router
	.route('/:id')
	.get(protect, restrictToSelfOr('admin'), getUser)
	.patch(protect, restrictTo('admin'), updateUser)
	.delete(protect, restrictTo('admin'), deleteUser);

router.route('/:id/orders').get(protect, restrictToSelfOr('admin'), getUserOrders);
router.route('/:id/tickets').get(protect, restrictToSelfOr('admin', 'worker'), getUserTickets);

export default router;
