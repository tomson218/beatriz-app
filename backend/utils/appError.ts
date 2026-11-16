type HttpStatusCode = 400 | 401 | 403 | 404 | 409 | 422 | 500;

class AppError extends Error {
	statusCode: number;
	status: string;
	isOperational: boolean;

	constructor(message: string, statusCode: HttpStatusCode) {
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppError;
