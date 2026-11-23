import { vi, type Mock } from 'vitest';

type ChainMethod = 'select' | 'populate' | 'sort' | 'lean' | 'exec';

export type MockQuery<T> = Promise<T> & Record<ChainMethod, Mock>;

const CHAIN_METHODS = ['select', 'populate', 'sort', 'lean'] as const;

/**
 * Imituje zapytanie Mongoose: metody łańcuchowe (`select`, `populate`, `sort`, `lean`) zwracają to samo zapytanie,
 * a `await` (bezpośrednio albo przez `exec()`) zwraca `result`.
 */
export const mockQuery = <T>(result: T): MockQuery<T> => {
	const query = Promise.resolve(result) as MockQuery<T>;

	CHAIN_METHODS.forEach(method => {
		query[method] = vi.fn(() => query);
	});
	query.exec = vi.fn(() => Promise.resolve(result));

	return query;
};
