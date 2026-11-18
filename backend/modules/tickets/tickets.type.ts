import type { HydratedDocumentFromSchema } from 'mongoose';
import type { ticketSchemaDef } from '@beatriz/shared/schemas/ticketSchema';

export type TicketDocument = HydratedDocumentFromSchema<typeof ticketSchemaDef>;

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
