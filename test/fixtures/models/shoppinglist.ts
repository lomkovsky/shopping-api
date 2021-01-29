import * as mongoose from 'mongoose';

import { ShoppingListSchema } from '../../../src/shoppinglist/shoppinglist.schema';

export const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);
