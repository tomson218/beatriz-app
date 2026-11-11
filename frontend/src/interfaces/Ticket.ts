export interface Ticket {
	_id: string;
	event: string;
	seating: {
		sector: string;
		block: string;
		seat?: string;
	};
	user: string;
	quantity: number;
	price: number;
	type: string;
	date: Date;
}
