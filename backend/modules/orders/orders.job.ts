import { expireOverdueOfflineOrders } from './orders.service.ts';

const CHECK_INTERVAL_MS: number = 60 * 1000;

const runExpiryCheck = async (): Promise<void> => {
	try {
		await expireOverdueOfflineOrders();
	} catch (error) {
		console.error('Overdue offline orders could not be expired:', error);
	}
};

/** Sprawdza zaległe wpłaty offline przy starcie serwera, a potem co minutę. */
export const startOfflineOrderExpiryJob = (): void => {
	void runExpiryCheck();
	setInterval(runExpiryCheck, CHECK_INTERVAL_MS);
};
