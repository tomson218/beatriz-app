const OFFLINE_PAYMENT_TIME_MS: number = 48 * 60 * 60 * 1000;

export const getOfflinePaymentDeadline = (orderDate: Date): Date => new Date(orderDate.getTime() + OFFLINE_PAYMENT_TIME_MS);

/** Zamówienia złożone w tej chwili lub wcześniej nie zostały opłacone na czas. */
export const getOverdueOrderDate = (): Date => new Date(Date.now() - OFFLINE_PAYMENT_TIME_MS);
