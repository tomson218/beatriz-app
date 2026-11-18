import validator from 'validator';
import bcrypt from 'bcryptjs';
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
	favouriteEventIds: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
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
}, {
	methods: {
		correctPassword(candidatePassword: string, userPassword: string): Promise<boolean> {
			return bcrypt.compare(candidatePassword, userPassword);
		},
	},
});

userSchema.virtual('favouriteEvents', { ref: 'Event', localField: 'favouriteEventIds', foreignField: '_id' });

userSchema.pre('save', async function (): Promise<void> {
	if (!this.isModified('password') || !this.password) return;

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
});

userSchema.pre(/^find/, function (this: Query<unknown, unknown>): void {
	this.find({ active: { $ne: false } });
});

