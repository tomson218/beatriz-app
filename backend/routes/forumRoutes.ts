import express, { type Express } from 'express';
import { getAllForumPosts, getPostsByEventId, addNewPostToForum } from '../controllers/forumController.ts';
import { protect } from '../controllers/authController.ts';

const router: Express = express.Router();

router
	.route('/')

	.get(protect, getAllForumPosts)

	.post(protect, addNewPostToForum);

router
	.route('/:eventId')

	.get(protect, getPostsByEventId);

export default router;
