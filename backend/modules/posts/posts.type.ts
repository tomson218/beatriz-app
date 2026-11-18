import type { HydratedDocumentFromSchema } from 'mongoose';
import type { forumSchema } from '@beatriz/shared/schemas/forumSchema';

export type PostDocument = HydratedDocumentFromSchema<typeof forumSchema>;

export interface PostsByEventParams {
	eventId: string;
}
