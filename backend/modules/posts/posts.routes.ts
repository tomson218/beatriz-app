/*

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import express from 'express';
import { getAllForumPosts } from './posts.controller.ts';
import { protect } from '../../shared/middleware/authMiddleware.ts';

const router = express.Router({ caseSensitive: true, strict: true });

router.get('/', protect, getAllForumPosts);

export default router;
