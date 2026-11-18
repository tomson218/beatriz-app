import { model } from 'mongoose';
import { userSchema } from '@beatriz/shared/schemas/userSchema';

const UserModel = model('User', userSchema);

export default UserModel;
