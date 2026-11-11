import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Schema, model, type InferSchemaType } from 'mongoose';
import type { NextFunction } from 'express';

export type User = InferSchemaType<typeof userSchema>;

const userSchema = new Schema({
	username: {
		type: String,
	},

	firstName: {
		type: String,
	},

	lastName: {
		type: String,
	},

	email: {
		type: String,
		required: [true, 'Please provide your email'],

		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
	},
	googleId: {
		type: String,
		unique: true,
	},

	facebookData: {
		type: Object,
	},
	photo: {
		type: String,
		default: 'defaultUser.jpg',
	},

	role: {
		type: String,
		enum: ['user', 'worker', 'admin'],
		default: 'user',
	},

	favouriteEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],

	password: {
		type: String,
		minlength: 8,
		select: false,
	},

	passwordConfirm: {
		type: String,

		validate: {
			validator: function (item) {
				return item === this.password;
			},
			message: 'Passwords are not the same1',
		},
	},

	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
	cart: {
		type: Array,
		default: [],
	},
	myCart: {
		type: Array,
		default: [],
		select: false,
	},
	appliedDiscountCodes: [
		{
			isUsed: {
				type: Boolean,
			},
			code: {
				type: String,
			},
		},
	],
});

userSchema.pre('save', async function (next: NextFunction) {
	if (!this.isModified('password')) return next();
	{
		this.password = await bcrypt.hash(this.password, 12);

		this.passwordConfirm = undefined;

		next();
	}
});

userSchema.pre('save', function (next: NextFunction) {
	if (!this.isModified('password') || this.insNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

userSchema.pre(/^find/, function (next: NextFunction) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

const UserModel = model('User', userSchema);

export default UserModel;
