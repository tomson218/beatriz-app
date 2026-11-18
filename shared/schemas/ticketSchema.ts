import { Schema } from 'mongoose';
import { TICKET_STATUSES } from '#enums/ticketStatuses';
import { TICKET_TYPES } from '#enums/ticketTypes';
import { seatingSchema } from '#schemas/utils';

export const ticketSchemaDef = new Schema({
	eventId: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
		required: [true, 'Please tell us your event'],
	},
	seating: {
		type: seatingSchema,
		required: [true, 'Please tell us your seating'],
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please tell us your user'],
	},
	quantity: {
		type: Number,
		required: [true, 'Please tell us your quantity'],
		min: 1,
		max: 999,
	},
	price: {
		type: Number,
		required: [true, 'Please tell us your price'],
		min: 1,
	},
	type: {
		type: String,
		required: [true, 'Please tell us your type of ticket'],
		enum: TICKET_TYPES,
	},
	date: {
		type: Date,
		required: [true, 'Please tell us your date of event'],
	},
	orderId: {
		type: Schema.Types.ObjectId,
		ref: 'Order',
	},
	status: {
		type: String,
		enum: TICKET_STATUSES,
		default: 'active',
	},
});

ticketSchemaDef.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true });
ticketSchemaDef.virtual('event', { ref: 'Event', localField: 'eventId', foreignField: '_id', justOne: true });

