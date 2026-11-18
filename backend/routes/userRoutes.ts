/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import {
	getAllUsers,
	createUser,
	getUser,
	updateMe,
	deleteMe,
	getUserFavoriteEvents,
	addEventToFavourite,
	removeEventFromFavourite,
	addCart,
	updateUser,
	deleteUser,
} from '../controllers/userController.ts';

import { protect, restrictTo, restrictToSelfOr } from '../middleware/authMiddleware.ts';

const router = express.Router({ caseSensitive: true, strict: true });

const getCurrentUser = (req: any, res: any, next: any): void => {
	const currentUserReq = {
		...req,
		params: {
			...req.params,
			id: req.user.id,
		},
	};

	return getUser(currentUserReq, res, next);
};

const removeFavouriteByParam = (req: any, res: any, next: any): void => {
	const removeFavouriteReq = {
		...req,
		body: {
			...(req.body ?? {}),
			eventId: req.params.eventId,
		},
	};

	return removeEventFromFavourite(removeFavouriteReq, res, next);
};

router.get('/me', protect, getCurrentUser);
router.patch('/me', protect, updateMe);
router.delete('/me', protect, deleteMe);
router.get('/me/favourites', protect, getUserFavoriteEvents);
router.post('/me/favourites', protect, addEventToFavourite);
router.delete('/me/favourites/:eventId', protect, removeFavouriteByParam);

router.patch('/editUser/:id', protect, restrictTo('admin'), updateUser);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);
router.get('/favourite', protect, getUserFavoriteEvents);
router.post('/addFavourite', protect, addEventToFavourite);
router.post('/addCart', protect, addCart);
router.delete('/removeFavourite', protect, removeEventFromFavourite);

router.route('/').get(protect, restrictTo('admin'), getAllUsers).post(protect, restrictTo('admin'), createUser);

router
	.route('/:id')
	.get(protect, restrictToSelfOr('admin'), getUser)
	.patch(protect, restrictTo('admin'), updateUser)
	.delete(protect, restrictTo('admin'), deleteUser);

export default router;
