import express from 'express';

import { getAllForumPosts, getPostsByEventId, addNewPostToForum } from '../controllers/forumController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router
	.route('/')

	.get(getAllForumPosts)

	.post(protect, addNewPostToForum);

router
	.route('/:eventId')

	.get(getPostsByEventId);

export default router;
