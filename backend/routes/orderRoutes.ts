/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { protect } from '../controllers/authController.ts';
import { getAllOrders, getUserOrders } from '../controllers/orderController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router
	.route('/')

	.get(protect, getAllOrders); // DZIAŁA

router
	.route('/users/:id') // /users/:id  ---> POPRAWIONO

	.get(protect, getUserOrders); // DZIAŁA

export default router;

/* 

{
    "status": "fail",
    "message": "Access requires a login. Please log in."
}

*/
