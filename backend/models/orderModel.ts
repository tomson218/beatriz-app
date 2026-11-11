import { Schema, model, type InferSchemaType } from 'mongoose';

export type Order = InferSchemaType<typeof orderSchema>;

const orderSchema = new Schema({
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
	},
	tickets: [
		{
			eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
			seating: [String],
			price: Number,
			type: {
				type: String,
				enum: ['normal', 'VIP', 'child'],
			},
		},
	],
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

const OrderModel = model('Order', orderSchema);

export default OrderModel;
