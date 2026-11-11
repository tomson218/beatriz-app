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
} from './../controllers/userController.js';
import {
	signup,
	login,
	forgetPassword,
	resetPassword,
	updatePassword,
	protect,
	googleLogin,
	facebookLogin,
} from './../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/googleLogin', googleLogin);

router.post('/facebookLogin', facebookLogin);

router.post('/forgetPassword', forgetPassword);

router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/editUser/:id', updateUser);

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

	.get(getUser)

	.delete(deleteUser);

export default router;
