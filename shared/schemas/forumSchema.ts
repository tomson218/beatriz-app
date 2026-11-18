import { Schema } from 'mongoose';

export const forumSchema = new Schema({
	date: {
		type: Date,
		required: [true, 'Please enter the date of the forum post'],
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please enter the user who created the forum post'],
	},
	eventId: {
		type: Schema.Types.ObjectId,
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

forumSchema.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true });
forumSchema.virtual('event', { ref: 'Event', localField: 'eventId', foreignField: '_id', justOne: true });

