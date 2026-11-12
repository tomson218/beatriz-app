import type { User } from '../models/userModel.ts';

/* 

{
    "status": "success",
    "results": 7,
    "users": [
        {
            "photo": "defaultUser.jpg",
            "favouriteEvents": [],
            "cart": [],
            "_id": "667857f279715153e64a8041",
            "username": "adminowo",
            "firstName": "MojAdmin",
            "lastName": "TwojAdmin",
            "email": "admin@gmail.com",
            "role": "admin",
            "googleId": "117413936876590094959",
            "appliedDiscountCodes": []
        },
        {
            "photo": "defaultUser.jpg",
            "cart": [],
            "_id": "6686b43878e0106e2612a98b",
            "username": "testowoo",
            "firstName": "MojTesto",
            "lastName": "TwojTest",
            "email": "testowo@gmail.com",
            "role": "user",
            "favouriteEvents": [
                "667f19e93d1cf728a7ff0934",
                "667f19e93d1cf728a7ff0935",
                "667f19e93d1cf728a7ff0933"
            ],
            "passwordChangedAt": "2024-07-05T11:27:45.823Z",
            "appliedDiscountCodes": []
        },
        {
            "_id": "668416369b433c0d004eaab1",
            "username": "mnowacki",
            "firstName": "Mariusz",
            "lastName": "Nowacki",
            "email": "s092787@student.tu.kielce.pl",
            "role": "user",
            "passwordChangedAt": "2024-11-29T17:03:00.380Z",
            "favouriteEvents": [
                "667f19e93d1cf728a7ff0934",
                "667f19e93d1cf728a7ff0933"
            ],
            "photo": "defaultUser.jpg",
            "cart": [],
            "appliedDiscountCodes": [
                {
                    "isUsed": true,
                    "code": "summer20",
                    "_id": "67bee2b7507340b2ddcd6921"
                }
            ]
        },
        {
            "cart": [],
            "_id": "66f1acf6db91df36d262bd1f",
            "username": "tomson218",
            "firstName": "Tomsonik",
            "lastName": "Pstrośkaty",
            "email": "tomasz.tp.pstrowski@gmail.com",
            "photo": "defaultUser.jpg",
            "role": "user",
            "favouriteEvents": [],
            "passwordChangedAt": "2024-09-23T18:01:25.934Z",
            "googleId": "117413936876590094959",
            "appliedDiscountCodes": []
        },
        {
            "_id": "6712bb5ae030df46e2e18e66",
            "email": "tomson.studia@gmail.com",
            "googleId": "108582620089614573863",
            "photo": "defaultUser.jpg",
            "role": "user",
            "favouriteEvents": [],
            "appliedDiscountCodes": [],
            "cart": []
        },
        {
            "_id": "672e652b7b9685287ef062c8",
            "email": "tomasz.pstrowski20@gmail.com",
            "facebookData": {
                "id": "1556226018361397",
                "picture": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1556226018361397&height=50&width=50&ext=1733688414&hash=Abbo8Slz24s4C2ZdGItgaI3B",
                "firstName": "Tomasz",
                "lastName": "Pstrowski"
            },
            "photo": "defaultUser.jpg",
            "role": "user",
            "favouriteEvents": [],
            "cart": [],
            "appliedDiscountCodes": []
        },
        {
            "_id": "6af59d9f264dd86e216e09f1",
            "username": "jan_kowalski",
            "firstName": "Jan",
            "lastName": "Kowalski",
            "email": "jan.kowalski@example.com",
            "photo": "defaultUser.jpg",
            "role": "user",
            "favouriteEvents": [],
            "passwordChangedAt": "2026-11-12T11:06:07.414Z",
            "cart": [],
            "appliedDiscountCodes": []
        }
    ]
}

*/

export type UserDto = Pick<
	User,
	| '_id'
	| 'username'
	| 'firstName'
	| 'lastName'
	| 'email'
	| 'photo'
	| 'favouriteEvents'
	| 'cart'
	| 'appliedDiscountCodes'
> & {role: string};

export type GetAllUsersResponse =
	| {
			status: 'success';
			results: number;
			users: UserDto[];
	  }
	| { status: 'error' | 'fail'; message: string };

export type GetUserResponse =
	| {
			status: 'success';
			user: UserDto;
	  }
	| { status: 'error' | 'fail'; message: string };

export type CreateUserRequest = {};

export type CreateUserResponse = {};

export type DeleteUserRequest = {};

export type DeleteUserResponse = {};
