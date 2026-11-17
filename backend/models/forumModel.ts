import { model } from 'mongoose';
import { forumSchema } from '@beatriz/shared/schemas/forumSchema';

export type { ForumPost as Forum } from '@beatriz/shared/forums';

const ForumModel = model('Forum', forumSchema);

export default ForumModel;
