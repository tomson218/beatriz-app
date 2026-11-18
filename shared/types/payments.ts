import type { CartTicket } from '#types/orders';

/**
 * Serwer traktuje `products` wyłącznie jako listę tego, co klient chce kupić:
 * ceny z tego pola są ignorowane i wyliczane z bazy.
 */
export interface CreateCheckoutSessionRequest {
	products: CartTicket[];
	discountCode?: string;
}

export interface CreateCheckoutSessionResponse {
	url?: string;
	error?: string;
}
