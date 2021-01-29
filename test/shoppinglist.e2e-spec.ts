import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { connectWithRetry } from './fixtures/mongooseInit';
import {
  SetupDatabase,
  userOne,
  itemOneUserOne,
  userTree,
  itemForCreate,
  itemTwoUserTree,
  shoppinglistForCreate,
  shoppinglistUserTree,
  shoppinglistUserOne,
} from './fixtures/db';

import { User } from './fixtures/models/users';

describe('shoppinglistController (e2e)', () => {
  let app: INestApplication;
  let access_token;

  beforeAll(async () => {
    await connectWithRetry();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    await SetupDatabase();
    const response1 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userTree.email,
        password: userTree.password,
      })
      .expect(200);
    // assert response body
    expect(response1.body.access_token).toBeDefined();
    expect(response1.body.refreshToken).toBeDefined();
    access_token = response1.body.access_token;
    await User.deleteMany();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    await SetupDatabase();
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await app.close();
  });

  it('/shoppinglist (Create new shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .post('/shoppinglist')
      .set('Authorization', `Bearer ${access_token}`)
      .send(shoppinglistForCreate)
      .expect(201);
    // assert response body
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toEqual(shoppinglistForCreate.name);
    expect(response.body.items).toHaveLength(2);
    expect(response.body.items[0].name).toEqual(itemTwoUserTree.name);
    expect(response.body.items[1].name).toEqual(itemOneUserOne.name);
    expect(response.body.owner._id).toEqual(userTree._id);
    expect(response.body.owner.name).toEqual(userTree.name);
    expect(response.body.owner.password).toBeUndefined();
  });

  it('/shoppinglist (Unauthorized and do not create new shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .post('/shoppinglist')
      .set('Authorization', `Bearer ${access_token}123`)
      .send(shoppinglistForCreate)
      .expect(401);
    // assert response body
    expect(response.body.access_token).toBeUndefined();
    expect(response.body.errorMessage).toEqual('Unauthorized');
  });

  it('/shoppinglist (Required name and do not create new shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .post('/shoppinglist')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        items: shoppinglistForCreate.items,
      })
      .expect(400);
    // assert response body
    expect(response.body.access_token).toBeUndefined();
    expect(response.body.errorMessage).toEqual(
      'ShoppingList validation failed: name: Path `name` is required.',
    );
  });

  it('/shoppinglist (findAll shopping lists)', async () => {
    const response = await request(app.getHttpServer())
      .get('/shoppinglist')
      .expect(200);
    // assert response body
    expect(response.body).toHaveLength(2);
  });

  it('/shoppinglist (findOne shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/shoppinglist/${shoppinglistUserTree._id}`)
      .expect(200);
    // assert response body
    expect(response.body._id).toEqual(shoppinglistUserTree._id);
    expect(response.body.name).toEqual(shoppinglistUserTree.name);
    expect(response.body.owner._id).toEqual(userTree._id);
    expect(response.body.owner.name).toEqual(userTree.name);
    expect(response.body.owner.password).toBeUndefined();
  });

  it('/shoppinglist (Cast to ObjectId failed findOne shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/shoppinglist/${shoppinglistUserTree._id}123`)
      .expect(400);
    // assert response body
    expect(response.body.errorType).toEqual('CastError');
  });

  it('/shoppinglist (Not found failed findOne shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .get('/shoppinglist/6012d781868068d2fe8057da')
      .expect(404);
    // assert response body
    expect(response.body.errorMessage).toEqual('Shopping list not found');
  });

  it('/shoppinglist (Update shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/shoppinglist/${shoppinglistUserTree._id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: shoppinglistForCreate.name,
      })
      .expect(200);
    // assert response body
    expect(response.body._id).toEqual(shoppinglistUserTree._id);
    expect(response.body.name).toEqual(shoppinglistForCreate.name);
    expect(response.body.owner._id).toEqual(userTree._id);
    expect(response.body.owner.name).toEqual(userTree.name);
    expect(response.body.owner.password).toBeUndefined();
  });

  it('/shoppinglist (Not found and not update shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .put('/shoppinglist/6012d781868068d2fe8057da')
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(404);
    // assert response body
    expect(response.body.access_token).toBeUndefined();
    expect(response.body.errorMessage).toEqual('Shopping List not found');
  });

  it('/shoppinglist (Cast to ObjectId failed and not update shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/shoppinglist/${itemTwoUserTree._id}123`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(400);
    // assert response body
    expect(response.body.errorType).toEqual('CastError');
  });

  it('/shoppinglist (Not owner and not update shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/shoppinglist/${shoppinglistUserOne._id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(400);
    // assert response body
    expect(response.body.errorMessage).toEqual('Not owner');
  });

  it('/shoppinglist (Delete shopping list)', async () => {
    await request(app.getHttpServer())
      .delete(`/shoppinglist/${shoppinglistUserTree._id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: shoppinglistForCreate.name,
      })
      .expect(204);
  });

  it('/shoppinglist (Not found and not delete shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/shoppinglist/6012d781868068d2fe8057da')
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(404);
    // assert response body
    expect(response.body.access_token).toBeUndefined();
    expect(response.body.errorMessage).toEqual('Shopping list not found');
  });

  it('/shoppinglist (Cast to ObjectId failed and not delete shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/shoppinglist/${itemTwoUserTree._id}123`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(400);
    // assert response body
    expect(response.body.errorType).toEqual('CastError');
  });

  it('/shoppinglist (Not owner and not delete shopping list)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/shoppinglist/${shoppinglistUserOne._id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(400);
    // assert response body
    expect(response.body.errorMessage).toEqual('Not owner');
  });
});
