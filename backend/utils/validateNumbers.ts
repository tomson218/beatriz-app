import AppError from './appError.ts';

export function validatePositiveNumber(value: number, fieldName: string): void {
	if (!Number.isFinite(value) || value <= 0) {
		throw new AppError(`${fieldName} musi być liczbą dodatnią`, 400);
	}
}

export function validateNonNegativeNumber(value: number, fieldName: string): void {
	if (!Number.isFinite(value) || value < 0) {
		throw new AppError(`${fieldName} nie może być liczbą ujemną`, 400);
	}
}
