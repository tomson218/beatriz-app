import type { Order } from '../models/orderModel.ts';

export type OrderDto = Pick<Order, '_id' | 'totalAmount' | 'date' | 'user' | 'currency' | 'tickets' | 'countOfTickets'>;

/* 

{
    "status": "success",
    "results": 1,
    "orders": [
        {
            "_id": "67bee2d1507340b2ddcd692c",
            "totalAmount": 619.3599999999999,
            "date": "2025-02-26T09:45:53.516Z",
            "user": "668416369b433c0d004eaab1",
            "currency": "PLN",
            "tickets": [
                {
                    "eventId": "6793660fd1790813361543a8",
                    "seating": [
                        {
                            "0": "1",
                            "_id": "6af5be16264dd86e216e0a1c"
                        }
                    ],
                    "price": 110.74,
                    "type": "normal",
                    "_id": "67bee2d1507340b2ddcd692d"
                },
                {
                    "eventId": "6793660fd1790813361543a8",
                    "seating": [
                        {
                            "0": "2",
                            "_id": "6af5be16264dd86e216e0a1e"
                        }
                    ],
                    "price": 110.74,
                    "type": "normal",
                    "_id": "67bee2d1507340b2ddcd692e"
                },
                {
                    "eventId": "6793660fd1790813361543a8",
                    "seating": [
                        {
                            "0": "3",
                            "_id": "6af5be16264dd86e216e0a20"
                        }
                    ],
                    "price": 198.94,
                    "type": "VIP",
                    "_id": "67bee2d1507340b2ddcd692f"
                },
                {
                    "eventId": "6793660fd1790813361543a8",
                    "seating": [
                        {
                            "0": "4",
                            "_id": "6af5be16264dd86e216e0a22"
                        }
                    ],
                    "price": 198.94,
                    "type": "VIP",
                    "_id": "67bee2d1507340b2ddcd6930"
                }
            ],
            "countOfTickets": 4
        }
    ]
}

*/

/* 

{
    "status": "success",
    "results": 1,
    "orders": [
        {
            "_id": "67bee2d1507340b2ddcd692c",
            "totalAmount": 619.3599999999999,
            "date": "2025-02-26T09:45:53.516Z",
            "user": "668416369b433c0d004eaab1",
            "currency": "PLN",
            "tickets": [
                {
                    "eventId": {
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
                    "seating": [
                        {
                            "0": "1",
                            "_id": "6af5bea3264dd86e216e0a30"
                        }
                    ],
                    "price": 110.74,
                    "type": "normal",
                    "_id": "67bee2d1507340b2ddcd692d"
                },
                {
                    "eventId": {
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
                    "seating": [
                        {
                            "0": "2",
                            "_id": "6af5bea3264dd86e216e0a32"
                        }
                    ],
                    "price": 110.74,
                    "type": "normal",
                    "_id": "67bee2d1507340b2ddcd692e"
                },
                {
                    "eventId": {
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
                    "seating": [
                        {
                            "0": "3",
                            "_id": "6af5bea3264dd86e216e0a34"
                        }
                    ],
                    "price": 198.94,
                    "type": "VIP",
                    "_id": "67bee2d1507340b2ddcd692f"
                },
                {
                    "eventId": {
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
                    "seating": [
                        {
                            "0": "4",
                            "_id": "6af5bea3264dd86e216e0a36"
                        }
                    ],
                    "price": 198.94,
                    "type": "VIP",
                    "_id": "67bee2d1507340b2ddcd6930"
                }
            ],
            "countOfTickets": 4
        }
    ]
}

*/

export type GetAllOrdersResponse =
	| {
			status: 'success';
			results: number;
			orders: OrderDto[];
	  }
	| { status: 'error' | 'fail'; message: string };

export type GetUserOrdersResponse =
	| {
			status: 'success';
			results: number;
			orders: OrderDto[];
	  }
	| { status: 'error' | 'fail'; message: string };
