import { Schema } from 'mongoose';
import { SECTORS } from '@/enums/sectors';
import { BLOCK_TYPES } from '@/enums/blockTypes';
import { TICKET_TYPES } from '@/enums/ticketTypes';

export const sectorSchema = {
	type: String,
	enum: SECTORS,
};

export const pricesSchema = {
	child: {
		type: Number,
		required: [true, 'Please tell us your child price of event'],
	},
	normal: {
		type: Number,
		required: [true, 'Please tell us your normal price of event'],
	},
	VIP: {
		type: Number,
		required: [true, 'Please tell us your VIP price of event'],
	},
};

export const seatingSchema = {
	sector: {
		...sectorSchema,
		required: [true, 'Please tell us your sector of seating'],
	},

	block: {
		type: String,
		required: [true, 'Please tell us your block of seating'],
		enum: BLOCK_TYPES,
	},

	seat: {
		type: Number,
		required: [true, 'Please tell us your seat of seating'],
		min: 1,
		max: 1000,
	},
};

export const ticketTypeSchema = {
	type: String,
	enum: TICKET_TYPES,
};

export const ticketSchema = {
	eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
	seating: [seatingSchema],
	price: Number,
	type: ticketTypeSchema,
};

export const appliedDiscountCodesSchema = {
	isUsed: {
		type: Boolean,
	},
	code: {
		type: String,
	},
};

/** @TODO: Define Facebook data schema once the structure is finalized. */
export const facebookDataSchema = '';

/** @TODO: Define cart schema once the cart structure is finalized. */
export const cartSchema = '';
