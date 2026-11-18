import { model } from 'mongoose';
import { userSchema } from '@beatriz/shared/schemas/userSchema';

export type { User } from '@beatriz/shared/users';

const UserModel = model('User', userSchema);

export default UserModel;
