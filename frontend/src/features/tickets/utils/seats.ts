/**
 * Parsuje parametr `seats` z URL i zwraca tablicę numerów miejsc.
 * Jeśli seats jest puste, null, lub '0', zwraca pustą tablicę.
 */
export function parseInitialSelectedSeats(seats: string | undefined): number[] {
	const hasNoSeatsParam = !seats;
	const isEmptySeatsPlaceholder = seats === '0';

	if (hasNoSeatsParam || isEmptySeatsPlaceholder) return [];
	return seats.split(',').map(seat => Number(seat));
}

/**
 * Sprawdza czy dane miejsce jest zajęte (w tablicy occupiedSeats).
 */
export function isSeatOccupied(seat: number, occupiedSeats: number[]): boolean {
	return occupiedSeats.includes(seat);
}

/**
 * Sprawdza czy dane miejsce jest wybrane (w tablicy selectedSeats).
 */
export function isSeatSelected(seat: number, selectedSeats: number[]): boolean {
	return selectedSeats.includes(seat);
}

/**
 * Sprawdza czy brak wybranych miejsc (selectedSeats jest puste).
 */
export function hasNoSelectedSeats(selectedSeats: number[]): boolean {
	return selectedSeats.length === 0;
}

/**
 * Buduje URL z parametrami miejsca (eventId, sector, block, seats).
 */
export function buildSeatsUrl(
	pathname: string,
	eventId: string,
	sector: string,
	block: string,
	seats: number[],
): string {
	return `${pathname}?eventId=${eventId}&sector=${sector}&block=${block}&seats=${seats.join(',')}`;
}

/**
 * Znacznik zamówienia bez numerowanych miejsc (używany zamiast numeru miejsca).
 */
export const NO_SEAT = 'no-seat';

/**
 * Sprawdza czy zamiast numeru miejsca przekazano znacznik "bez miejsca" (NO_SEAT).
 */
export function isNoSeatPlaceholder(seat: string): boolean {
	return seat === NO_SEAT;
}
