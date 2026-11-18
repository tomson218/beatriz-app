export type ApiStatus = 'success' | 'fail' | 'error';

/**
 * Koperta każdej odpowiedzi API: `{ status, message?, data }`.
 * Błędy (4xx/5xx) mają postać `ErrorResponse`.
 */
export interface ApiResponse<TData = null> {
	status: ApiStatus;
	message?: string;
	data: TData;
}

/** Odpowiedź bez danych, np. `{ status: 'success', message: 'Token sent to email!' }`. */
export interface MessageResponse {
	status: ApiStatus;
	message: string;
}

/** Odpowiedź błędu (4xx/5xx), np. `{ status: 'fail', message: 'Incorrect email or password' }`. */
export interface ErrorResponse {
	status: Exclude<ApiStatus, 'success'>;
	message: string;
}

/** Lista zasobów: `{ status, data: { results, [K]: T[] } }`, np. `ListResponse<'events', EventDto>`. */
export type ListResponse<K extends string, T> = ApiResponse<{ results: number } & Record<K, T[]>>;

/** Pojedynczy zasób: `{ status, data: { [K]: T } }`, np. `ItemResponse<'event', EventDto>`. */
export type ItemResponse<K extends string, T> = ApiResponse<Record<K, T>>;
