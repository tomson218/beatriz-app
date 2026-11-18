import { type Request, type Response, type NextFunction } from 'express';
import UserModel from '../models/userModel.ts';
import AppError from '../utils/appError.ts';
import { getBearerToken, verifyAccessToken } from '../utils/authTokens.ts';
import type { User, UserRole } from '@beatriz/shared/users';

/** Wymaga zalogowania: weryfikuje access token i zapisuje użytkownika w `req.user`. */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const accessToken = getBearerToken(req);

		if (!accessToken) {
			return res.status(401).json({ status: 'fail', message: 'Access requires a login. Please log in.' });
		}

		const decodedToken = await verifyAccessToken(accessToken);

		const user: User | null = await UserModel.findById(decodedToken.id);

		if (!user) {
			return res
				.status(401)
				.json({ status: 'fail', message: 'The user associated with this token cannot be found.' });
		}

		req.user = user;
		next();
	} catch (err) {
		res.status(500).json({ status: 'fail', message: err.message });
	}
};

/** Dostęp tylko dla podanych ról. Używać po `protect`. */
export const restrictTo = (...roles: UserRole[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const hasRequiredRole = roles.includes(req.user.role);

		if (!hasRequiredRole) {
			return next(new AppError('You do not have permission to perform this action', 403));
		}

		next();
	};
};

/** Dostęp dla właściciela zasobu (`:id` w ścieżce to id zalogowanego użytkownika) albo dla podanych ról. Używać po `protect`. */
export const restrictToSelfOr = (...roles: UserRole[]) => {
	return (req: Request<{ id?: string }>, res: Response, next: NextFunction) => {
		const hasIdParam = req.params.id !== undefined;
		const isOwner = hasIdParam && String(req.user.id) === String(req.params.id);
		const hasRequiredRole = roles.includes(req.user.role);

		if (!isOwner && !hasRequiredRole) {
			return next(new AppError('You do not have permission to perform this action', 403));
		}

		next();
	};
};
