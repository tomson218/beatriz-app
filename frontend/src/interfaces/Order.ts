import { Ticket } from './Ticket';

export interface Order {
	_id: string;
	totalAmount: number;
	date: Date;
	user: string;
	currency: string;
	tickets: Ticket[];
}
