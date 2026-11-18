import type { HydratedDocumentFromSchema } from 'mongoose';
import type { userSchema } from '@beatriz/shared/schemas/userSchema';

export type UserDocument = HydratedDocumentFromSchema<typeof userSchema>;
