/*

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { protect, restrictTo } from '../../shared/middleware/authMiddleware.ts';
import { getAllOrders } from './orders.controller.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router.get('/', protect, restrictTo('admin'), getAllOrders);

export default router;
