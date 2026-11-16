/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { protect } from '../controllers/authController.ts';
import { getAllOrders, getUserOrders } from '../controllers/orderController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

const getCurrentUserOrders = (req: any, res: any, next: any): void => {
	const currentUserOrdersReq = {
		...req,
		params: {
			...req.params,
			id: req.user.id,
		},
	};

	return getUserOrders(currentUserOrdersReq, res, next);
};

router.route('/').get(protect, getAllOrders);

router.get('/me', protect, getCurrentUserOrders);
router.get('/users/:id', protect, getUserOrders);
router.get('/:id', protect, getCurrentUserOrders);

export default router;

/* 

{
    "status": "fail",
    "message": "Access requires a login. Please log in."
}

*/
