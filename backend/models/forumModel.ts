import mongoose from 'mongoose';

const forumSchema = new mongoose.Schema({
	date: {
		type: Date,
		required: [true, 'Please enter the date of the forum post'],
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please enter the user who created the forum post'],
	},
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event',
		required: [true, 'Please enter the event related to the forum post'],
	},
	message: {
		type: String,
		required: [true, 'Please enter a message content'],
		trim: true,
		maxlength: [1000, 'Message content should not exceed 1000 characters'],
	},
});

const Forum = mongoose.model('forum', forumSchema);

export default Forum;
