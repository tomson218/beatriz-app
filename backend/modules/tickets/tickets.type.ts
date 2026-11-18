// Kontrakt API współdzielony z frontendem: encje, DTO, requesty i response'y.
export type {
	BlockType,
	GetOccupiedSeatsRequest,
	GetOccupiedSeatsResponse,
	GroupAvailableSectorsResponse,
	OccupiedSeatsParams,
	Ticket,
	TicketDto,
	TicketIdParams,
	TicketRequest,
	TicketsResponse,
	TicketType,
} from '@beatriz/shared/tickets';

/** Liczba biletów lub wolnych miejsc w podziale na sektory (klucz: oznaczenie sektora). */
export type SectorCounts = Record<string, number>;

export interface FreeSectorsSummary {
	ticketsCount: number;
	freeSectorsCount: SectorCounts;
}

export interface UserTicketsParams {
	id: string;
}

export interface EventTicketsParams {
	eventId: string;
}
