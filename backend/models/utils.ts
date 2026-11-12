import { Schema } from 'mongoose';
import { TICKET_TYPES } from '../capacityHall.ts';

export const facebookDataSchema = ''; // TO__DO

/* 


id
"1556226018361397"
picture
"https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1556226…"
firstName
"Tomasz"
lastName
"Pstrowski"

*/

export const cartScheama = ''; // TO__DO

export const appliedDiscountCodesSchema = ''; // TO__DO

export const sectorSchema = {
	type: String,
	enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
};

export const seatingSchema = {
	sector: {
		sectorSchema,
		required: [true, 'Please tell us your sector of seating'],
	},

	block: {
		type: String,
		required: [true, 'Please tell us your block of seating'],
		enum: ['blue', 'green', 'yellow', 'black'],
	},

	seat: {
		type: Number,
		required: [true, 'Please tell us your seat of seating'],
		min: 1,
		max: 1000, // sprawdzić jeszcze to, oki???
	},
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

export const ticketTypeSchema = {
	type: String,
	enum: TICKET_TYPES,
};

export const ticketSchema = {
	eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
	seating: [seatingSchema],
	price: Number,
	type: ticketTypeSchema,
}; // TO__DO
