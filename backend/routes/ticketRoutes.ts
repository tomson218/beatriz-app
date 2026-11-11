import express from 'express';
import { protect } from '../controllers/authController.ts';

import {
	getAllTickets,
	getUserTickets,
	groupAvailableSectors,
	getOccupiedSeats,
} from '../controllers/ticketController.ts';

const router = express.Router();

router
	.route('/')

	.get(protect, getAllTickets);

router
	.route('/:id')

	.get(protect, getUserTickets);

router
	.route('/availableSectors/:eventId')

	.get(protect, groupAvailableSectors);

router
	.route('/occupiedSeats/:eventId/:sector/:block')

	.get(protect, getOccupiedSeats);

export default router;
