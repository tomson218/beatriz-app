/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { protect } from '../controllers/authController.ts';

import {
	getAllTickets,
	getUserTickets,
	groupAvailableSectors,
	getOccupiedSeats,
} from '../controllers/ticketController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router
	.route('/')

	.get(protect, getAllTickets); // DZIAŁA

router
	.route('/users/:id') // /users/:id ---> POPRAWIONO

	.get(protect, getUserTickets); // działa

router
	.route('/events/:eventId/available-sectors') // poprawionnnnnnnnnnneeeeeeeeeeeeeeeeee

	.get(protect, groupAvailableSectors);

router
	.route('/events/:eventId/occupied-seats/:sector/:block') //POIORAWIONNNNNNNNNNEEEEEEEEEEEEEEEEEE

	.get(protect, getOccupiedSeats);

export default router;
