import type { ApiStatus } from '@beatriz/shared/common';

/** Każda odpowiedź API zawiera pole `status` (patrz `ApiResponse` w `@beatriz/shared/common`). */
export interface StatusResponse {
	status: ApiStatus;
}

/** Sprawdza czy odpowiedź API zakończyła się sukcesem. */
export function isSuccessResponse(response: StatusResponse): boolean {
	return response.status === 'success';
}

/** Sprawdza czy odpowiedź API NIE zakończyła się sukcesem (`fail` lub `error`). */
export function isFailedResponse(response: StatusResponse): boolean {
	return !isSuccessResponse(response);
}
