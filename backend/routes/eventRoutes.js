import express from 'express';
import { protect, restrictTo } from './../controllers/authController.js';
import { getAllEvents, createEvent, getEvent, updateEvent, deleteEvent } from './../controllers/eventController.js';
import { uploadEventImage } from './../controllers/eventController.js';

const router = express.Router();

router
	.route('/')

	.get(protect, getAllEvents)

	.post(uploadEventImage, createEvent);

router
	.route('/:id')

	.get(getEvent)

	.patch(updateEvent)

	.delete(protect, restrictTo('admin', 'worker'), deleteEvent);

export default router;
