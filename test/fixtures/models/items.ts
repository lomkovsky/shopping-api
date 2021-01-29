import * as mongoose from 'mongoose';

import { ItemsSchema } from '../../../src/items/items.schema';

export const Items = mongoose.model('Items', ItemsSchema);
