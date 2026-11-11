import { Schema, model } from 'mongoose';
import validator from 'validator';

const discountCodeSchema = new Schema({
	code: {
		type: String,
		required: [true, 'Please enter a discount code'],
		unique: true,
		validate: [validator.isAlphanumeric, 'Discount code should only contain alphanumeric characters'],
	},
	value: {
		type: Number,
		required: [true, 'Please enter a discount value'],
		min: 0,
		max: 1,
	},
	expiration: {
		type: Date,
		required: [true, 'Please enter a discount expiration date'],
	},
	usageLimit: {
		type: Number,
		required: [true, 'Please enter a discount usage limit'],
		min: 0,
		max: 1000,
	},

	usageConditions: {
		type: Number,
		required: [true, 'Please enter a discount usage conditions'],
	},
});

const DiscountCode = model('DiscountCode', discountCodeSchema, 'discountCodes');

export default DiscountCode;
