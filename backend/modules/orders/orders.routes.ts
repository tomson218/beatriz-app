/*

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { protect, restrictTo } from '../../shared/middleware/authMiddleware.ts';
import { validateObjectId } from '../../shared/middleware/validateObjectId.ts';
import { createOfflineOrder, getAllOrders, updateOrderStatus } from './orders.controller.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router.param('id', validateObjectId);

router.route('/').get(protect, restrictTo('admin'), getAllOrders).post(protect, createOfflineOrder);

router.route('/:id').patch(protect, restrictTo('admin'), updateOrderStatus);

export default router;
