import { Schema } from 'mongoose';
import { ticketSchema } from '#schemas/utils';
import { CURRENCIES } from '#enums/currencies';
import { ORDER_STATUSES } from '#enums/orderStatuses';
import { PAYMENT_METHODS } from '#enums/paymentMethods';

export const orderSchema = new Schema({
	totalAmount: {
		type: Number,
		required: [true, 'Please tell us your name of event'],
	},
	date: {
		type: Date,
		required: [true, 'Please tell us your date of event'],
	},
	userId: {
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
	eventId: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
	},
	countOfTickets: {
		type: Number,
		required: [true, 'Please tell us your quantity'],
		min: 1,
		max: 999,
	},
	paymentMethod: {
		type: String,
		enum: PAYMENT_METHODS,
		default: 'online',
	},
	status: {
		type: String,
		enum: ORDER_STATUSES,
		default: 'paid',
	},
	discountCode: String,
});

orderSchema.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true });
orderSchema.virtual('event', { ref: 'Event', localField: 'eventId', foreignField: '_id', justOne: true });

