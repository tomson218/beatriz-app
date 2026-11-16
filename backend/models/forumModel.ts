import { Schema, model, Types, type InferSchemaType } from 'mongoose';

export type Forum = InferSchemaType<typeof forumSchema> & {
	_id: Types.ObjectId;
};

const forumSchema = new Schema({
	date: {
		type: Date,
		required: [true, 'Please enter the date of the forum post'],
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please enter the user who created the forum post'],
	},
	event: {
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

const ForumModel = model('Forum', forumSchema);

export default ForumModel;
