/** An error thrown by the services: a message and an optional HTTP status code. */
export type HttpError = Error & { statusCode?: number };

/** Calls the function and returns the error it throws, so it can be compared with `expected`. */
export const catchError = (fn: () => unknown): HttpError => {
	try {
		fn();
	} catch (error) {
		return error as HttpError;
	}

	throw new Error('Expected the function to throw, but it did not.');
};

/** Awaits the promise and returns the error it was rejected with. */
export const catchAsyncError = async (promise: Promise<unknown>): Promise<HttpError> => {
	try {
		await promise;
	} catch (error) {
		return error as HttpError;
	}

	throw new Error('Expected the promise to reject, but it resolved.');
};
