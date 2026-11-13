/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';

import {
	signup,
	login,
	forgetPassword,
	resetPassword,
	updatePassword,
	protect,
	googleLogin,
	facebookLogin,
	refreshAccessToken,
	logout,
} from '../controllers/authController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router.post('/signup', signup); /* DZIAŁA */

router.post('/login', login);

router.post('/refresh-token', refreshAccessToken);

router.post('/logout', protect, logout);

router.post('/googleLogin', googleLogin);

router.post('/facebookLogin', facebookLogin);

router.post('/forgetPassword', protect, forgetPassword);

router.patch('/resetPassword/:token', protect, resetPassword); // sprawdzić!!!!

router.patch('/updateMyPassword', protect, updatePassword);

export default router;
