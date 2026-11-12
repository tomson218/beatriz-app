import type { Ticket } from '../models/ticketModel.ts';

export type TicketDto = Pick<Ticket, '_id' | 'event' | 'seating' | 'user' | 'quantity' | 'price' | 'type' | 'date'> & {
	_v?: number;
};

/* 

{
    "status": "success",
    "tickets": [
        {
            "_id": "67bee2d1507340b2ddcd6932",
            "event": "6793660fd1790813361543a8",
            "seating": {
                "sector": "A",
                "block": "black",
                "seat": 1,
                "_id": "6af5b7d6264dd86e216e0a15"
            },
            "user": "668416369b433c0d004eaab1",
            "quantity": 1,
            "price": 110.74,
            "type": "normal",
            "date": "2025-02-26T09:45:53.582Z",
            "__v": 0
        },
        {
            "_id": "67bee2d1507340b2ddcd6933",
            "event": "6793660fd1790813361543a8",
            "seating": {
                "sector": "A",
                "block": "black",
                "seat": 2,
                "_id": "6af5b7d6264dd86e216e0a16"
            },
            "user": "668416369b433c0d004eaab1",
            "quantity": 1,
            "price": 110.74,
            "type": "normal",
            "date": "2025-02-26T09:45:53.582Z",
            "__v": 0
        },
        {
            "_id": "67bee2d1507340b2ddcd6934",
            "event": "6793660fd1790813361543a8",
            "seating": {
                "sector": "A",
                "block": "black",
                "seat": 3,
                "_id": "6af5b7d6264dd86e216e0a17"
            },
            "user": "668416369b433c0d004eaab1",
            "quantity": 1,
            "price": 198.94,
            "type": "VIP",
            "date": "2025-02-26T09:45:53.582Z",
            "__v": 0
        },
        {
            "_id": "67bee2d1507340b2ddcd6935",
            "event": "6793660fd1790813361543a8",
            "seating": {
                "sector": "A",
                "block": "black",
                "seat": 4,
                "_id": "6af5b7d6264dd86e216e0a18"
            },
            "user": "668416369b433c0d004eaab1",
            "quantity": 1,
            "price": 198.94,
            "type": "VIP",
            "date": "2025-02-26T09:45:53.582Z",
            "__v": 0
        }
    ]
}

*/

// należy pamiętać o dwóch możliwściach: ta z suekcem i ta z bledem

export type GetAllTicketsResponse = { status: 'success'; tickets: TicketDto[] } | { status: 'fail'; message: string };

/* 

{
    "status": "success",
    "results": 4,
    "tickets": [
        {
            "_id": "67bee2d1507340b2ddcd6932",
            "event": {
                "prices": {
                    "child": 85,
                    "normal": 150,
                    "VIP": 270
                },
                "_id": "6793660fd1790813361543a8",
                "name": "Festiwal Sztuki „Martwa natura”",
                "date": "2025-05-28T14:00:00.000Z",
                "star": [
                    "Anna Nowak"
                ],
                "description": "Z żywo, po teatr uliczny. Festiwal ma na celu promowanie lokalnych talentów oraz zbliżenie społeczności poprzez wspólne doświadczenie sztuki i kultury.”",
                "seatRequired": true,
                "sectors": [
                    "A",
                    "B",
                    "C",
                    "D"
                ],
                "image": "event-1737713167269-948461958.jpeg",
                "type": "festival",
                "createdAt": "2025-01-24T10:06:07.551Z",
                "updatedAt": "2025-01-24T10:06:07.551Z",
                "__v": 0
            },
            "seating": {
                "sector": "A",
                "block": "black",
                "seat": 1,
                "_id": "6af5bfa5264dd86e216e0a44"
            },
            "user": "668416369b433c0d004eaab1",
            "quantity": 1,
            "price": 110.74,
            "type": "normal",
            "date": "2025-02-26T09:45:53.582Z",
            "__v": 0
        },
        {
            "_id": "67bee2d1507340b2ddcd6933",
            "event": {
                "prices": {
                    "child": 85,
                    "normal": 150,
                    "VIP": 270
                },
                "_id": "6793660fd1790813361543a8",
                "name": "Festiwal Sztuki „Martwa natura”",
                "date": "2025-05-28T14:00:00.000Z",
                "star": [
                    "Anna Nowak"
                ],
                "description": "Z żywo, po teatr uliczny. Festiwal ma na celu promowanie lokalnych talentów oraz zbliżenie społeczności poprzez wspólne doświadczenie sztuki i kultury.”",
                "seatRequired": true,
                "sectors": [
                    "A",
                    "B",
                    "C",
                    "D"
                ],
                "image": "event-1737713167269-948461958.jpeg",
                "type": "festival",
                "createdAt": "2025-01-24T10:06:07.551Z",
                "updatedAt": "2025-01-24T10:06:07.551Z",
                "__v": 0
            },
            "seating": {
                "sector": "A",
                "block": "black",
                "seat": 2,
                "_id": "6af5bfa5264dd86e216e0a45"
            },
            "user": "668416369b433c0d004eaab1",
            "quantity": 1,
            "price": 110.74,
            "type": "normal",
            "date": "2025-02-26T09:45:53.582Z",
            "__v": 0
        },
        {
            "_id": "67bee2d1507340b2ddcd6934",
            "event": {
                "prices": {
                    "child": 85,
                    "normal": 150,
                    "VIP": 270
                },
                "_id": "6793660fd1790813361543a8",
                "name": "Festiwal Sztuki „Martwa natura”",
                "date": "2025-05-28T14:00:00.000Z",
                "star": [
                    "Anna Nowak"
                ],
                "description": "Z żywo, po teatr uliczny. Festiwal ma na celu promowanie lokalnych talentów oraz zbliżenie społeczności poprzez wspólne doświadczenie sztuki i kultury.”",
                "seatRequired": true,
                "sectors": [
                    "A",
                    "B",
                    "C",
                    "D"
                ],
                "image": "event-1737713167269-948461958.jpeg",
                "type": "festival",
                "createdAt": "2025-01-24T10:06:07.551Z",
                "updatedAt": "2025-01-24T10:06:07.551Z",
                "__v": 0
            },
            "seating": {
                "sector": "A",
                "block": "black",
                "seat": 3,
                "_id": "6af5bfa5264dd86e216e0a46"
            },
            "user": "668416369b433c0d004eaab1",
            "quantity": 1,
            "price": 198.94,
            "type": "VIP",
            "date": "2025-02-26T09:45:53.582Z",
            "__v": 0
        },
        {
            "_id": "67bee2d1507340b2ddcd6935",
            "event": {
                "prices": {
                    "child": 85,
                    "normal": 150,
                    "VIP": 270
                },
                "_id": "6793660fd1790813361543a8",
                "name": "Festiwal Sztuki „Martwa natura”",
                "date": "2025-05-28T14:00:00.000Z",
                "star": [
                    "Anna Nowak"
                ],
                "description": "Z żywo, po teatr uliczny. Festiwal ma na celu promowanie lokalnych talentów oraz zbliżenie społeczności poprzez wspólne doświadczenie sztuki i kultury.”",
                "seatRequired": true,
                "sectors": [
                    "A",
                    "B",
                    "C",
                    "D"
                ],
                "image": "event-1737713167269-948461958.jpeg",
                "type": "festival",
                "createdAt": "2025-01-24T10:06:07.551Z",
                "updatedAt": "2025-01-24T10:06:07.551Z",
                "__v": 0
            },
            "seating": {
                "sector": "A",
                "block": "black",
                "seat": 4,
                "_id": "6af5bfa5264dd86e216e0a47"
            },
            "user": "668416369b433c0d004eaab1",
            "quantity": 1,
            "price": 198.94,
            "type": "VIP",
            "date": "2025-02-26T09:45:53.582Z",
            "__v": 0
        }
    ]
}

*/

export type GetUserTicketsResponse = {};

export type GroupAvailableSectorsRequest = {};

export type GroupAvailableSectorsResponse = {};

export type GetOccupiedSeatsRequest = {};

export type GetOccupiedSeatsResponse = {};
