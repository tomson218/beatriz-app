import type { ItemResponse, ListResponse } from '@beatriz/shared/common';

/** Lista zasobów w kopercie API: `{ status, data: { results, [key]: items } }`. */
export const listResponse = <K extends string, T>(key: K, items: T[]): ListResponse<K, T> => ({
	status: 'success',
	data: { results: items.length, [key]: items } as ListResponse<K, T>['data'],
});

/** Pojedynczy zasób w kopercie API: `{ status, data: { [key]: item } }`. */
export const itemResponse = <K extends string, T>(key: K, item: T): ItemResponse<K, T> => ({
	status: 'success',
	data: { [key]: item } as ItemResponse<K, T>['data'],
});
