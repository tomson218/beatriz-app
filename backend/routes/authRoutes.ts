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
	googleLogin,
	facebookLogin,
	refreshAccessToken,
	logout,
} from '../controllers/authController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router.post('/signup', signup);
router.post('/login', login);

router.post('/refresh', refreshAccessToken);
router.post('/refresh-token', refreshAccessToken);

router.post('/logout', protect, logout);

router.post('/googleLogin', googleLogin);
router.post('/facebookLogin', facebookLogin);

router.post('/password/forgot', forgetPassword);
router.post('/forgetPassword', forgetPassword);

router.post('/password/reset/:token', resetPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/password', protect, updatePassword);
router.patch('/updateMyPassword', protect, updatePassword);

export default router;
