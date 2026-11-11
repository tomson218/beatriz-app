import mongoose from 'mongoose';
import validator from 'validator';
const { Schema } = mongoose;

const ticketSchema = new mongoose.Schema({
	event: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
		required: [true, 'Please tell us your event'],
	},
	seating: {
		type: Object,
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
		min: 0,
	},
	type: {
		type: String,
		required: [true, 'Please tell us your type of ticket'],
		enum: ['normal', 'VIP', 'child'],
	},

	date: {
		type: Date,
		required: [true, 'Please tell us your date of event'],
	},
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
