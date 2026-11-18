
export function validatePositiveNumber(value: number, fieldName: string): void {
	if (!Number.isFinite(value) || value <= 0) {
		throw Object.assign(new Error(`${fieldName} musi być liczbą dodatnią`), { statusCode: 400 });
	}
}

export function validateNonNegativeNumber(value: number, fieldName: string): void {
	if (!Number.isFinite(value) || value < 0) {
		throw Object.assign(new Error(`${fieldName} nie może być liczbą ujemną`), { statusCode: 400 });
	}
}
