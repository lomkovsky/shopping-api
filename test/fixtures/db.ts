import { Items } from './models/items';
import { User } from './models/users';
import { ShoppingList } from './models/shoppinglist';

export const userOne = {
  _id: '6012d781868068d1fe8047da',
  name: 'userOne name',
  email: 'userOne@email.com',
  password: 'userOne password',
};

export const userTree = {
  _id: '6012d781868068d1fe8057da',
  name: 'userTree name',
  email: 'userTree@email.com',
  password: 'userTree password',
  refreshTokens: [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDEyZDc4MTg2ODA2OGQxZmU4MDQ3ZGEiLCJpYXQiOjE2MTE4NDc2NTgsImV4cCI6MTYxMjQ1MjQ1OH0.CjZX2-28LCwdWQXSoN_cn7dUdsBBAy_sFA2d6E3lIX0',
  ],
};

export const userTwoForCreate = {
  name: 'userTwoForCreate name',
  email: 'userTwoForCreate@email.com',
  password: 'userTwoForCreate password',
};

export const itemOneUserOne = {
  _id: '6013a7ba8196c52d8bf39de6',
  name: 'itemOneUserOne name',
  price: 'itemOneUserOne price',
  owner: userOne._id,
};

export const itemTwoUserTree = {
  _id: '6013a7ba8196c52d9bf39de6',
  name: 'itemTwoUserOne name',
  price: 'itemTwoUserOne price',
  owner: userTree._id,
};

export const itemForCreate = {
  name: 'itemForCreate name',
  price: 'itemForCreate price',
};

export const shoppinglistForCreate = {
  name: 'shoppinglistForCreate name',
  items: [itemTwoUserTree._id, itemOneUserOne._id],
};

export const shoppinglistUserTree = {
  _id: '6013a7ba8196c53d8bf39de6',
  name: 'shoppinglistUserTree name',
  items: [itemTwoUserTree._id, itemOneUserOne._id],
  owner: userTree._id,
};

export const shoppinglistUserOne = {
  _id: '6013a7ba8296c53d8bf39de6',
  name: 'shoppinglistUserOne name',
  items: [itemTwoUserTree._id],
  owner: userOne._id,
};

export const SetupDatabase = async () => {
  await Promise.all([
    User.deleteMany(),
    Items.deleteMany(),
    ShoppingList.deleteMany(),
  ]);
  const userOneMongo = new User(userOne);
  const userTreeMongo = new User(userTree);
  await Promise.all([userOneMongo.save(), userTreeMongo.save()]);
  const itemOneUserOneMongo = new Items(itemOneUserOne);
  const itemTwoUserTreeMongo = new Items(itemTwoUserTree);
  await Promise.all([itemOneUserOneMongo.save(), itemTwoUserTreeMongo.save()]);
  const shoppinglistUserOneMongo = new ShoppingList(shoppinglistUserOne);
  const shoppinglistUserTreeMongo = new ShoppingList(shoppinglistUserTree);
  await Promise.all([
    shoppinglistUserTreeMongo.save(),
    shoppinglistUserOneMongo.save(),
  ]);
};
