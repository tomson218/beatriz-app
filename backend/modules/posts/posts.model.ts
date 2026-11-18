import { model } from 'mongoose';
import { forumSchema } from '@beatriz/shared/schemas/forumSchema';

const ForumModel = model('Forum', forumSchema);

export default ForumModel;
