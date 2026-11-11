import { FacebookData } from './FacebookData';

export interface User {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	passwordConfirm: string;
	passwordResetExpires: Date;
	passwordResetToken: string;
	active: boolean;
	googleId: string;
	facebookData: FacebookData;
	cart: [];
}
