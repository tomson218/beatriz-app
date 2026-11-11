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

import { protect } from '../controllers/authController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router.patch('/editUser/:id', protect, updateUser);

router.patch('/updateMe', protect, updateMe);

router.delete('/deleteMe', protect, deleteMe);

router.get('/favourite', protect, getUserFavoriteEvents);

router.post('/addFavourite', protect, addEventToFavourite);

router.post('/addCart', protect, addCart);

router.delete('/removeFavourite', protect, removeEventFromFavourite);

router
	.route('/')

	.get(protect, getAllUsers)

	.post(createUser);

router
	.route('/:id')

	.get(protect, getUser)

	.delete(protect, deleteUser);

export default router;
