import type { CartTicket } from '@/orders';

export interface CreateCheckoutSessionRequest {
	order: CartTicket[];
}

export interface CreateCheckoutSessionResponse {
	url?: string;
	error?: string;
}
