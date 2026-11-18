/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { protect, restrictTo, restrictToSelfOr } from '../middleware/authMiddleware.ts';

import {
	getAllTickets,
	getUserTickets,
	groupAvailableSectors,
	getOccupiedSeats,
} from '../controllers/ticketController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

const getCurrentUserTickets = (req: any, res: any, next: any): void => {
	const currentUserTicketsReq = {
		...req,
		params: {
			...req.params,
			id: req.user.id,
		},
	};

	return getUserTickets(currentUserTicketsReq, res, next);
};

const getSeatsByQuery = (req: any, res: any, next: any): void => {
	const seatsReq = {
		...req,
		params: {
			...req.params,
			sector: String(req.query.sector ?? ''),
			block: String(req.query.block ?? ''),
		},
	};

	return getOccupiedSeats(seatsReq, res, next);
};

router.route('/').get(protect, restrictTo('admin', 'worker'), getAllTickets);

router.get('/me', protect, getCurrentUserTickets);
router.get('/users/:id', protect, restrictToSelfOr('admin', 'worker'), getUserTickets);

router.get('/events/:eventId/available-sectors', protect, groupAvailableSectors);
router.get('/events/:eventId/availability', protect, groupAvailableSectors);
router.get('/events/:eventId/tickets/availability', protect, groupAvailableSectors);

router.get('/events/:eventId/occupied-seats/:sector/:block', protect, getOccupiedSeats);
router.get('/events/:eventId/tickets/seats', protect, getSeatsByQuery);

export default router;
