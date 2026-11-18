import type { CheckoutItem } from '../../utils/checkout.ts';

// Kontrakt API współdzielony z frontendem: request i response.
export type { CreateCheckoutSessionRequest, CreateCheckoutSessionResponse } from '@beatriz/shared/payments';

/** Treść żądania utworzenia sesji płatności. Z `products` bierzemy tylko to, CO klient kupuje: ceny liczy serwer. */
export interface CheckoutRequestBody {
	products: unknown;
	discountCode?: unknown;
}

/** Zatwierdzony koszyk zapisany w `myCart` (pozycje z cenami wyliczonymi na serwerze). */
export type ApprovedCartItem = CheckoutItem;
