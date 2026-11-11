import express from 'express';
import { protect } from './../controllers/authController.js';

import {
	getAllTickets,
	getUserTickets,
	groupAvailableSectors,
	getOccupiedSeats,
} from '../controllers/ticketController.js';

const router = express.Router();

router
	.route('/')

	.get(getAllTickets);

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
