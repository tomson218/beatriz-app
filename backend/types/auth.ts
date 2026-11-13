//import type { User } from '../models/userModel.ts';

import type { UserDto } from './users.ts';

import type { SuccessList, SuccessItem, ErrorResponse } from './users.ts';

// raczej passwordChangedAt nie powinien byc w req.body, bo to jest ustawiane automatycznie przy zmianie hasla, a nie przy rejestracji.
// podobnie jak role, bo to w bazie danych powinno być zmienione

export type SignUpRequest = Pick<UserDto, 'username' | 'firstName' | 'lastName' | 'email'> & {
	passwordChangedAt: string;
} & { password: string } & { role: string };

/* 

{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZjU5ZDlmMjY0ZGQ4NmUyMTZlMDlmMSIsImlhdCI6MTc5NDQ4MTU2OCwiZXhwIjoxODAyMjU3NTY4fQ.JKA2OKCDtwa2nnYhY3k9BV-JPNx54eIzSCHbAySCA40",
    "user": {
        "username": "jan_kowalski",
        "firstName": "Jan",
        "lastName": "Kowalski",
        "email": "jan.kowalski@example.com",
        "photo": "defaultUser.jpg",
        "role": "user",
        "favouriteEvents": [],
        "password": "$2a$12$qHsg4iBgwvSQmSpVv3vrY.q.lLPZtadU2uMJctTEuFmJ4D5C6fVkm",
        "passwordChangedAt": "2026-11-12T11:06:07.414Z",
        "active": true,
        "cart": [],
        "myCart": [],
        "_id": "6af59d9f264dd86e216e09f1",
        "appliedDiscountCodes": [],
        "__v": 0
    }
}


// wywalic stad role, password, passwordChangedAt, cart, myCart, appliedDiscountCodes, __v, _id, bo to nie powinno byc wysylane do frontendu. Wysylac tylko username, firstName, lastName, email, photo, role, favouriteEvents

*/

export type SignUpResponse =
	| {
			status: string;
			token: string;
			user: UserDto & { passwordChangedAt: string } & { password: string } & { active: boolean } & {
				myCart: any;
			} & {
				role: string;
			};
	  }
	| { status: 'error' | 'fail'; message: string };

export type LoginRequest = Pick<UserDto, 'email'> & { password: string };

type LoginResponse = []; // sprawdzić

export type GoogleLoginRequest = {
	authCode: any;
	clientId: any;
	selectBy: any;
};

export type FacebookLoginRequest = {
	tokens: any;
	userProfile: any;
};

export type ForgetPasswordRequest = Pick<UserDto, 'email'>;

/* 





export type GoogleLoginResponse = {}; | { status: 'error' | 'fail'; message: string };



export type FacebookLoginResponse = {}; | { status: 'error' | 'fail'; message: string };



export type ForgetPasswordResponse = {}; | { status: 'error' | 'fail'; message: string };

export type ResetPasswordRequest = {}; | { status: 'error' | 'fail'; message: string };

export type ResetPasswordResponse = {}; | { status: 'error' | 'fail'; message: string };

export type UpdatePasswordRequest = {}; | { status: 'error' | 'fail'; message: string };

export type UpdatePasswordResponse = {}; | { status: 'error' | 'fail'; message: string };


*/
