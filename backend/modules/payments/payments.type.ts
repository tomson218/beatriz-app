import type { CheckoutItem } from '../../utils/checkout.ts';

/** Treść żądania zakupu. Z `products` bierzemy tylko to, CO klient kupuje: ceny liczy serwer. */
export interface CheckoutRequestBody {
	products: unknown;
	discountCode?: unknown;
}

/** Pozycje z cenami wyliczonymi na serwerze i kod rabatowy użyty do ich obliczenia. */
export interface PreparedCheckout {
	items: CheckoutItem[];
	discountCode: string;
}

/** Dane biletu potrzebne do wygenerowania pliku PDF. */
export interface PdfTicket {
	name?: string | null;
	date?: Date | string | null;
	sector?: string | null;
	block?: string | null;
	seating?: string | number | null;
	price?: number | null;
	type?: string | null;
}
