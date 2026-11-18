/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';

import {
	signup,
	login,
	googleLogin,
	facebookLogin,
	refreshAccessToken,
	logout,
} from './auth.controller.ts';
import { protect } from '../../shared/middleware/authMiddleware.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router.post('/signup', signup);
router.post('/login', login);

router.post('/refresh', refreshAccessToken);

router.post('/logout', protect, logout);

router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);

export default router;
