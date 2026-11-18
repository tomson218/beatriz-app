import type { OrderStatus } from '@beatriz/shared/orders';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	pending: 'Oczekuje na potwierdzenie wpłaty',
	paid: 'Opłacone',
	rejected: 'Odrzucone',
	expired: 'Wygasło: brak wpłaty w ciągu 48 godzin',
};
