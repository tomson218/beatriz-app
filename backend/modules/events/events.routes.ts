/*

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { protect, restrictTo } from '../../shared/middleware/authMiddleware.ts';
import { getAllEvents, createEvent, getEvent, updateEvent, deleteEvent } from './events.controller.ts';
import { addNewPostToForum, getPostsByEventId } from '../posts/posts.controller.ts';
import { getOccupiedSeats, groupAvailableSectors } from '../tickets/tickets.controller.ts';
import { validateObjectId } from '../../shared/middleware/validateObjectId.ts';
import { uploadEventImage } from '../../utils/images.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router.param('id', validateObjectId);
router.param('eventId', validateObjectId);

router
	.route('/')
	.get(protect, getAllEvents)
	.post(protect, restrictTo('admin', 'worker'), uploadEventImage, createEvent);

router
	.route('/:id')
	.get(protect, getEvent)
	.patch(protect, restrictTo('admin', 'worker'), updateEvent)
	.delete(protect, restrictTo('admin', 'worker'), deleteEvent);

router
	.route('/:eventId/posts')
	.get(protect, getPostsByEventId)
	.post(protect, addNewPostToForum);

router.route('/:eventId/availability').get(protect, groupAvailableSectors);
router.route('/:eventId/occupied-seats').get(protect, getOccupiedSeats);

export default router;
