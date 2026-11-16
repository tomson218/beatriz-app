/**
 * Parsuje parametr `seats` z URL i zwraca tablicę numerów miejsc.
 * Jeśli seats jest puste, null, lub '0', zwraca pustą tablicę.
 */
export function parseInitialSelectedSeats(seats: string | undefined): number[] {
	if (!seats || seats === '0') return [];
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
