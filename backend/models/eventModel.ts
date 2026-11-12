import { Schema, model, type InferSchemaType } from 'mongoose';
import { sectorSchema, pricesSchema } from './utils.ts';

export type Event = InferSchemaType<typeof eventSchema> & {
	_id: string;
};

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
			type: [String],
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
			type: [sectorSchema],
			required: [true, 'Please tell us your sectors of event'],
		},

		image: {
			type: String,
			default: 'default.jpg',
		},
		prices: pricesSchema,
		type: {
			type: String,
			required: [true, 'Please tell us your type of event'],
			default: 'concert',
			enum: ['concert', 'theater', 'opera', 'musical', 'festival', 'other'],
		},
	},
	{
		timestamps: true,
	},
);

const EventModel = model('Event', eventSchema);

export default EventModel;
