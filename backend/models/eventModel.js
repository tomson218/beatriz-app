import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please tell us your name of event'],
		},
		date: {
			type: Date,
			required: [true, 'Please tell us your date of event'],
		},
		star: {
			type: Array,
			required: [true, 'Please tell us your stars of event'],
		},
		description: {
			type: String,
			required: [true, 'Please tell us your description of event'],
		},
		seatRequired: {
			type: Boolean,
			required: [true, 'Please tell us your seatRequired of event'],
		},
		sectors: {
			type: Array,
			required: [true, 'Please tell us your sectors of event'],
		},
		image: {
			type: String,
			default: 'default.jpg',
		},
		prices: {
			type: Object,
			required: [true, 'Please tell us your price of event'],
		},
		type: {
			type: String,
			required: [true, 'Please tell us your type of event'],
			default: 'concert',
		},
	},
	{
		timestamps: true,
	}
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
