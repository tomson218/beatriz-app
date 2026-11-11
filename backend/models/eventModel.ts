import { Schema, model, type InferSchemaType } from 'mongoose';

export type Event = InferSchemaType<typeof eventSchema>;

const starSchema = ''; // TO__DO

const sectorSchema = ''; // TO__DO

const pricesSchema = ''; // TO__DO

const eventSchema = new Schema(
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

			// jak wyglada ta tablica
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
			// ["A", "B", "C", "D", "E", "F", "G", "H"]
			required: [true, 'Please tell us your sectors of event'],
		},
		image: {
			type: String,
			default: 'default.jpg',
		},
		prices: {
			type: Object,
			required: [true, 'Please tell us your price of event'],

			// jak wyglada ten obiekt
		},
		type: {
			type: String,
			required: [true, 'Please tell us your type of event'],
			default: 'concert',

			// dodac enuma
		},
	},
	{
		timestamps: true,
	},
);

const EventModel = model('Event', eventSchema);

export default EventModel;
