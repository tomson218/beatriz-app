import Forum from '../models/forumModel.js';

export const getAllForumPosts = async (req, res, next) => {
	try {
		const forumPosts = await Forum.find().select('-__v');

		res.status(200).json({
			status: 'success',
			results: forumPosts.length,
			forumPosts,
		});
	} catch (err) {
		next(err);
	}
};

export const getPostsByEventId = async (req, res, next) => {
	try {
		const { eventId } = req.params;

		const forumPosts = await Forum.find({ event: eventId }).populate('user').select('-__v').sort({ date: 1 });

		res.status(200).json({
			status: 'success',
			results: forumPosts.length,
			forumPosts,
		});
	} catch (err) {
		next(err);
	}
};

export const addNewPostToForum = async (req, res, next) => {
	try {
		const userId = req.user.id;

		const { message, eventId } = req.body;

		const newPost = await Forum.create({
			user: userId,
			message: message,
			event: eventId,
			date: Date.now(),
		});

		res.status(200).json({
			status: 'success',
			newPost,
		});
	} catch (err) {
		next(err);
	}
};
