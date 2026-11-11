/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { getAllForumPosts, getPostsByEventId, addNewPostToForum } from '../controllers/forumController.ts';
import { protect } from '../controllers/authController.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router
	.route('/')

	.get(protect, getAllForumPosts)

	.post(protect, addNewPostToForum);

router
	.route('/:eventId')

	.get(protect, getPostsByEventId);

export default router;
