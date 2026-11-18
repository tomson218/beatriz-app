/**
 * Sprawdza czy sektor jest dostępny dla wydarzenia.
 */
export function isSectorAvailable(sector: string, availableSectors: string[]): boolean {
	return availableSectors.includes(sector);
}

/**
 * Buduje URL do wyboru strefy (blocks) dla danego sektora.
 * Zwraca pustego stringa, jeśli sektor nie jest wybrany.
 */
export function buildBlocksUrl(eventId: string, sector: string): string {
	const isSectorNotSelected = sector === '';

	if (isSectorNotSelected) {
		return '';
	}
	return `/blocks?eventId=${eventId}&sector=${sector}`;
}

/**
 * Sprawdza czy wiadomość jest pusta (po usunięciu białych znaków).
 */
export function isEmptyMessage(message: string): boolean {
	return message.trim() === '';
}
