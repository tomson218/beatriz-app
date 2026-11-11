export interface Event {
	_id: string;
	name: string;
	description: string;
	star: string[];
	date: Date;
	image: string;
	seatRequired: boolean;
	sectors: string[];
	prices: {
		normal: number;
		child: number;
		VIP: number;
	};
}
