import type { UserDocument } from '../../modules/users/users.type.ts';

declare global {
	namespace Express {
		interface Request {
			user: UserDocument;
		}
	}
}
