/** Błąd rzucany przez serwisy: komunikat i opcjonalny kod HTTP. */
export type HttpError = Error & { statusCode?: number };

/** Wywołuje funkcję i zwraca rzucony błąd, żeby można go było porównać z `expected`. */
export const catchError = (fn: () => unknown): HttpError => {
	try {
		fn();
	} catch (error) {
		return error as HttpError;
	}

	throw new Error('Expected the function to throw, but it did not.');
};

/** Czeka na obietnicę i zwraca błąd, którym została odrzucona. */
export const catchAsyncError = async (promise: Promise<unknown>): Promise<HttpError> => {
	try {
		await promise;
	} catch (error) {
		return error as HttpError;
	}

	throw new Error('Expected the promise to reject, but it resolved.');
};
