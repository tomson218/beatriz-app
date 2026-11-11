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
} from '../controllers/authController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router.post('/signup', signup);

router.post('/login', login);

router.post('/googleLogin', googleLogin);

router.post('/facebookLogin', facebookLogin);

router.post('/forgetPassword', protect, forgetPassword);

router.patch('/resetPassword/:token', protect, resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

export default router;
