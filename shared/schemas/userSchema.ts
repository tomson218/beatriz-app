import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Schema, type Query } from 'mongoose';
import { USER_ROLES } from '#enums/userRoles';
import { appliedDiscountCodesSchema } from '#schemas/utils';

export const userSchema = new Schema({
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
		// sparse: konta bez googleId (rejestracja hasłem) nie mogą kolidować ze sobą na pustej wartości.
		unique: true,
		sparse: true,
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
		enum: USER_ROLES,
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
			validator: function (item: string) {
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
	appliedDiscountCodes: [appliedDiscountCodesSchema],
});

userSchema.pre('save', async function (): Promise<void> {
	if (!this.isModified('password') || !this.password) return;

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
});

userSchema.pre('save', function (): void {
	if (!this.isModified('password') || this.isNew) return;

	this.passwordChangedAt = new Date(Date.now() - 1000);
});

userSchema.pre(/^find/, function (this: Query<unknown, unknown>): void {
	this.find({ active: { $ne: false } });
});

userSchema.methods.correctPassword = async function (
	candidatePassword: string,
	userPassword: string,
): Promise<boolean> {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
	if (this.passwordChangedAt) {
		const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
		return JWTTimestamp < changedTimestamp;
	}
	return false;
};

userSchema.methods.createPasswordResetToken = function (): string {
	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

