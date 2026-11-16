export interface ErrorResponse {
	message: string;
	statusCode: number;
}

export interface SuccessList<T = unknown> {
	data: T[];
}

export interface SuccessItem<T = unknown> {
	data: T;
}
