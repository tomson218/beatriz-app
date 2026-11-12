import type { Forum } from '../models/forumModel.ts';
import type { Event } from '../models/eventModel.ts';

/* 

{
    "status": "success",
    "results": 30,
    "forumPosts": [
        {
            "_id": "6713bc5e29454f94d242dd35",
            "date": "2024-10-13T14:00:00.000Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0934",
            "message": "I had some issues with the online ticketing system. The payment took a while to process. Anyone else experienced the same problem?"
        },
        {
            "_id": "6713bd4729454f94d242dd3c",
            "date": "2024-10-15T18:45:00.000Z",
            "user": "6686b43878e0106e2612a98b",
            "event": "667f19e93d1cf728a7ff0936",
            "message": "The event was great, but parking was a nightmare! They need better organization next time. Arrive early if you're going to future events."
        },
        {
            "_id": "6713bd4729454f94d242dd3d",
            "date": "2024-10-16T09:15:00.000Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0936",
            "message": "The sound system at this event was top-notch. Every note was crystal clear. Kudos to the event organizers for investing in such quality equipment!"
        },
        {
            "_id": "6713bd4729454f94d242dd3b",
            "date": "2024-10-14T14:00:00.000Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0934",
            "message": "I had some issues with the online ticketing system. The payment took a while to process. Anyone else experienced the same problem?"
        },
        {
            "_id": "6713bd4729454f94d242dd3e",
            "date": "2024-10-17T16:30:00.000Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0934",
            "message": "This was my first time attending, and I'm already planning to go next year. Fantastic event, well organized, and full of energy."
        },
        {
            "_id": "67178672fcb901d6802d33d5",
            "date": "2024-10-22T11:03:14.364Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "gfgfgfggfgffgfg"
        },
        {
            "_id": "6717872ffcb901d6802d3420",
            "date": "2024-10-22T11:06:23.754Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "fhjgdhfdhdfghfdghhgfgfdfd"
        },
        {
            "_id": "6737e814161d1ea47d958592",
            "date": "2024-11-16T00:32:20.534Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "hhjhjh"
        },
        {
            "_id": "6746e2ddb3de5e34fd1e33cf",
            "date": "2024-11-27T09:14:05.359Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0937",
            "message": "Testowy post"
        },
        {
            "_id": "6778105fd1fd15489023876c",
            "date": "2025-01-03T16:29:19.889Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "6778107aa5c318ba14118d16",
            "date": "2025-01-03T16:29:46.849Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "677810da479ee401e105c6b6",
            "date": "2025-01-03T16:31:22.961Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "67781184ee09d477072b0c20",
            "date": "2025-01-03T16:34:12.785Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "677811e76433b94efcc50506",
            "date": "2025-01-03T16:35:51.643Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "677811fd025fa030474669b6",
            "date": "2025-01-03T16:36:13.889Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "67781233c95a8b040c9c8c3f",
            "date": "2025-01-03T16:37:07.221Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "677839a986d11a2b8d4553c8",
            "date": "2025-01-03T19:25:29.347Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "677839e309284bbcbfa979b0",
            "date": "2025-01-03T19:26:27.286Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "67783af05286ae590e8971a1",
            "date": "2025-01-03T19:30:56.606Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "67783b1206c291c7dfe11b2d",
            "date": "2025-01-03T19:31:30.957Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "67783b80449ba0733102ff5f",
            "date": "2025-01-03T19:33:20.721Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "67783bb79234ff8c99d7d675",
            "date": "2025-01-03T19:34:15.543Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "67783e2a1881220c24c57f21",
            "date": "2025-01-03T19:44:42.718Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post v8"
        },
        {
            "_id": "6778418a62665704980cd4ea",
            "date": "2025-01-03T19:59:06.461Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post v8"
        },
        {
            "_id": "677841a479527a0158e556ec",
            "date": "2025-01-03T19:59:32.458Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post v888888888888888"
        },
        {
            "_id": "678ed9ba76021b7ccbfe009f",
            "date": "2025-01-20T23:18:18.248Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "6790bc18a4e39822bbc57f4b",
            "date": "2024-12-06T18:09:01.226Z",
            "user": "6686b43878e0106e2612a98b",
            "event": "667f19e93d1cf728a7ff0935",
            "message": "Prezentacje były konkretne i pełne praktycznych przykładów, a prelegenci chętnie odpowiadali na pytania uczestników. Polecam takie wydarzenia każdemu, kto lubi być na bieżąco z nowinkami technologicznymi."
        },
        {
            "_id": "6792a47c38727c2eb6123534",
            "date": "2025-01-23T20:20:12.207Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0935",
            "message": "Bardzo mi się podobało to wydarzenie! Atmosfera była świetna i myślę, że warto byłoby je powtórzyć w przyszłości."
        },
        {
            "_id": "67a3c4cae5e8d9c4d32c31d6",
            "date": "2025-02-05T20:06:34.605Z",
            "user": "668416369b433c0d004eaab1",
            "event": "667f19e93d1cf728a7ff0933",
            "message": "Test post"
        },
        {
            "_id": "67bedfdbbf968b5d31204196",
            "date": "2025-02-26T09:33:15.949Z",
            "user": "668416369b433c0d004eaab1",
            "event": "6793660fd1790813361543a8",
            "message": "Nie mogę się doczekać już tego festiwalu."
        }
    ]
}

*/

type ForumPostDto = Pick<Forum, '_id' | 'date' | 'user' | 'event' | 'message'>;

export type GetAllForumPostsResponse =
	| { status: 'success'; results: number; forumPosts: ForumPostDto[] }
	| { status: 'fail' | 'error'; message: string };

export type AddNewPostToForumRequest = Pick<ForumPostDto, 'message'> & { eventId: Event['_id'] };

export type AddNewPostToForumResponse = {};

/* 

{
    "status": "success",
    "results": 3,
    "forumPosts": [
        {
            "_id": "6713bc5e29454f94d242dd35",
            "date": "2024-10-13T14:00:00.000Z",
            "user": {
                "_id": "668416369b433c0d004eaab1",
                "username": "mnowacki",
                "firstName": "Mariusz",
                "lastName": "Nowacki",
                "email": "s092787@student.tu.kielce.pl",
                "role": "user", // po co??
                "passwordChangedAt": "2024-11-29T17:03:00.380Z", // po co??
                "__v": 194, // po co???
                "favouriteEvents": [
                    "667f19e93d1cf728a7ff0934",
                    "667f19e93d1cf728a7ff0933"
                ], // po co???
                "photo": "defaultUser.jpg",
                "cart": [], // po co?
                "appliedDiscountCodes": [
                    {
                        "isUsed": true,
                        "code": "summer20",
                        "_id": "67bee2b7507340b2ddcd6921"
                    }
                ] po co?????
            },
            "event": "667f19e93d1cf728a7ff0934",
            "message": "I had some issues with the online ticketing system. The payment took a while to process. Anyone else experienced the same problem?"
        },
        {
            "_id": "6713bd4729454f94d242dd3b",
            "date": "2024-10-14T14:00:00.000Z",
            "user": {
                "_id": "668416369b433c0d004eaab1",
                "username": "mnowacki",
                "firstName": "Mariusz",
                "lastName": "Nowacki",
                "email": "s092787@student.tu.kielce.pl",
                "role": "user",
                "passwordChangedAt": "2024-11-29T17:03:00.380Z",
                "__v": 194,
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
            "event": "667f19e93d1cf728a7ff0934",
            "message": "I had some issues with the online ticketing system. The payment took a while to process. Anyone else experienced the same problem?"
        },
        {
            "_id": "6713bd4729454f94d242dd3e",
            "date": "2024-10-17T16:30:00.000Z",
            "user": {
                "_id": "668416369b433c0d004eaab1",
                "username": "mnowacki",
                "firstName": "Mariusz",
                "lastName": "Nowacki",
                "email": "s092787@student.tu.kielce.pl",
                "role": "user",
                "passwordChangedAt": "2024-11-29T17:03:00.380Z",
                "__v": 194,
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
            "event": "667f19e93d1cf728a7ff0934",
            "message": "This was my first time attending, and I'm already planning to go next year. Fantastic event, well organized, and full of energy."
        }
    ]
}

*/

// tu jest obiekt zagniezodzony user, a tam wczesniej user zawierajacy id po prostu, kumasz??

export type GetPostsByEventIdResponse =
	| {
			status: 'success';
			results: number;
			forumPosts: ForumPostDto[];
	  }
	| { status: 'error' | 'fail'; message: string };
