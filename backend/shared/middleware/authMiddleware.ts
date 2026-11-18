import type { NextFunction, Request, Response } from 'express';
import UserModel from '../../modules/users/users.model.ts';
import { getBearerToken, verifyAccessToken } from '../../utils/authTokens.ts';
import type { UserRole } from '@beatriz/shared/users';
import type { UserDocument } from '../../modules/users/users.type.ts';

const createForbiddenError = (): Error =>
	Object.assign(new Error('You do not have permission to perform this action'), { statusCode: 403 });

/** Wymaga zalogowania: weryfikuje access token i zapisuje użytkownika w `req.user`. */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const accessToken: string | undefined = getBearerToken(req);

	if (!accessToken) {
		res.status(401).json({ status: 'fail', message: 'Access requires a login. Please log in.' });
		return;
	}

	let userId: string;

	try {
		userId = verifyAccessToken(accessToken).id;
	} catch {
		res.status(401).json({ status: 'fail', message: 'Invalid or expired token. Please log in again.' });
		return;
	}

	try {
		const user: UserDocument | null = await UserModel.findById(userId);

		if (!user) {
			res.status(401).json({ status: 'fail', message: 'The user associated with this token cannot be found.' });
			return;
		}

		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

/** Dostęp tylko dla podanych ról. Używać po `protect`. */
export const restrictTo = (...roles: UserRole[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		next(roles.includes(req.user.role) ? undefined : createForbiddenError());
	};
};

/** Dostęp dla właściciela zasobu (`:id` w ścieżce to id zalogowanego użytkownika) albo dla podanych ról. Używać po `protect`. */
export const restrictToSelfOr = (...roles: UserRole[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const isOwner: boolean = String(req.user._id) === req.params.id;

		next(isOwner || roles.includes(req.user.role) ? undefined : createForbiddenError());
	};
};
