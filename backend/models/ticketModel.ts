import { Schema, model, Types, type InferSchemaType } from 'mongoose';
import { TICKET_TYPES } from '../capacityHall.ts';
import { seatingSchema } from './utils.ts';

export type Ticket = InferSchemaType<typeof ticketSchema> & {
	_id: Types.ObjectId;
};

const ticketSchema = new Schema({
	event: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
		required: [true, 'Please tell us your event'],
	},
	seating: {
		type: seatingSchema,
		required: [true, 'Please tell us your seating'],
	},
	user: {
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
});

const TicketModel = model('Ticket', ticketSchema);

export default TicketModel;
