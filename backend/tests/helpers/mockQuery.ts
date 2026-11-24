import { vi, type Mock } from 'vitest';

type ChainMethod = 'select' | 'populate' | 'sort' | 'lean' | 'exec';

export type MockQuery<T> = Promise<T> & Record<ChainMethod, Mock>;

const CHAIN_METHODS = ['select', 'populate', 'sort', 'lean'] as const;

/**
 * Imitates a Mongoose query: the chain methods (`select`, `populate`, `sort`, `lean`) return the same query,
 * and awaiting it (directly or via `exec()`) resolves to `result`.
 */
export const mockQuery = <T>(result: T): MockQuery<T> => {
	const query = Promise.resolve(result) as MockQuery<T>;

	CHAIN_METHODS.forEach(method => {
		query[method] = vi.fn(() => query);
	});
	query.exec = vi.fn(() => Promise.resolve(result));

	return query;
};
