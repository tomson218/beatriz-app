import { Schema, model } from 'mongoose';
import { ticketSchema } from './utils';
import { CURRENCIES } from '@/enums/currencies';

export const orderSchema = new Schema({
	totalAmount: {
		type: Number,
		required: [true, 'Please tell us your name of event'],
	},
	date: {
		type: Date,
		required: [true, 'Please tell us your date of event'],
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please tell us your user of event'],
	},
	currency: {
		type: String,
		required: [true, 'Please tell us your currency of event'],
		enum: CURRENCIES,
	},
	tickets: [ticketSchema],
	event: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
	},
	countOfTickets: {
		type: Number,
		required: [true, 'Please tell us your quantity'],
		min: 1,
		max: 999,
	},
});

