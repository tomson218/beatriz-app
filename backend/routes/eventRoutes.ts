/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/


import express from 'express';
import { protect, restrictTo } from '../controllers/authController.ts';
import { getAllEvents, createEvent, getEvent, updateEvent, deleteEvent } from '../controllers/eventController.ts';
import { uploadEventImage } from '../controllers/eventController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router
	.route('/')

	.get(protect, getAllEvents)

	.post(protect, uploadEventImage, createEvent);

router
	.route('/:id')

	.get(protect, getEvent)

	.patch(protect, updateEvent)

	.delete(protect, restrictTo('admin', 'worker'), deleteEvent);

export default router;
