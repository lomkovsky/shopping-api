import * as mongoose from 'mongoose';

import { UserSchema } from '../../../src/users/users.schema';

export const User = mongoose.model('User', UserSchema);
