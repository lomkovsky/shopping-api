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
} from './fixtures/db';

import { User } from './fixtures/models/users';

describe('itemController (e2e)', () => {
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

  it('/items (Create new item)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(201);
    // assert response body
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toEqual(itemForCreate.name);
    expect(response.body.price).toEqual(itemForCreate.price);
    expect(response.body.owner._id).toEqual(userTree._id);
    expect(response.body.owner.name).toEqual(userTree.name);
    expect(response.body.owner.password).toBeUndefined();
  });

  it('/items (Unauthorized and do not create new item)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('Authorization', `Bearer ${access_token}123`)
      .send(itemForCreate)
      .expect(401);
    // assert response body
    expect(response.body.access_token).toBeUndefined();
    expect(response.body.errorMessage).toEqual('Unauthorized');
  });

  it('/items (Required name and do not create new item)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        price: itemForCreate.price,
      })
      .expect(400);
    // assert response body
    expect(response.body.access_token).toBeUndefined();
    expect(response.body.errorMessage).toEqual(
      'Items validation failed: name: Path `name` is required.',
    );
  });

  it('/items (Required price and do not create new item)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: itemForCreate.name,
      })
      .expect(400);
    // assert response body
    expect(response.body.access_token).toBeUndefined();
    expect(response.body.errorMessage).toEqual(
      'Items validation failed: price: Path `price` is required.',
    );
  });

  it('/items (findAll items)', async () => {
    const response = await request(app.getHttpServer())
      .get('/items')
      .expect(200);
    // assert response body
    expect(response.body).toHaveLength(2);
  });

  it('/items (findOne item)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/items/${itemOneUserOne._id}`)
      .expect(200);
    // assert response body
    expect(response.body._id).toEqual(itemOneUserOne._id);
    expect(response.body.name).toEqual(itemOneUserOne.name);
    expect(response.body.price).toEqual(itemOneUserOne.price);
    expect(response.body.owner._id).toEqual(userOne._id);
    expect(response.body.owner.name).toEqual(userOne.name);
    expect(response.body.owner.password).toBeUndefined();
  });

  it('/items (Cast to ObjectId failed findOne item)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/items/${itemOneUserOne._id}123`)
      .expect(400);
    // assert response body
    expect(response.body.errorType).toEqual('CastError');
  });

  it('/items (Not found failed findOne item)', async () => {
    const response = await request(app.getHttpServer())
      .get('/items/6012d781868068d2fe8057da')
      .expect(404);
    // assert response body
    expect(response.body.errorMessage).toEqual('Item not found');
  });

  it('/items (Update item)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/items/${itemTwoUserTree._id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(200);
    // assert response body
    expect(response.body._id).toEqual(itemTwoUserTree._id);
    expect(response.body.name).toEqual(itemForCreate.name);
    expect(response.body.price).toEqual(itemForCreate.price);
    expect(response.body.owner._id).toEqual(userTree._id);
    expect(response.body.owner.name).toEqual(userTree.name);
    expect(response.body.owner.password).toBeUndefined();
  });

  it('/items (Update item without changes)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/items/${itemTwoUserTree._id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
    // assert response body
    expect(response.body._id).toEqual(itemTwoUserTree._id);
    expect(response.body.name).toEqual(itemTwoUserTree.name);
    expect(response.body.price).toEqual(itemTwoUserTree.price);
    expect(response.body.owner._id).toEqual(userTree._id);
    expect(response.body.owner.name).toEqual(userTree.name);
    expect(response.body.owner.password).toBeUndefined();
  });

  it('/items (Not found and not update item)', async () => {
    const response = await request(app.getHttpServer())
      .put('/items/6012d781868068d2fe8057da')
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(404);
    // assert response body
    expect(response.body.access_token).toBeUndefined();
    expect(response.body.errorMessage).toEqual('Item not found');
  });

  it('/items (Cast to ObjectId failed and not update item)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/items/${itemTwoUserTree._id}123`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(400);
    // assert response body
    expect(response.body.errorType).toEqual('CastError');
  });

  it('/items (Not owner and not update item)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/items/${itemOneUserOne._id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(400);
    // assert response body
    expect(response.body.errorMessage).toEqual('Not owner');
  });

  it('/items (Delete item)', async () => {
    await request(app.getHttpServer())
      .delete(`/items/${itemTwoUserTree._id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(204);
  });

  it('/items (Not found and not delete item)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/items/6012d781868068d2fe8057da')
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(404);
    // assert response body
    expect(response.body.access_token).toBeUndefined();
    expect(response.body.errorMessage).toEqual('Item not found');
  });

  it('/items (Cast to ObjectId failed and not delete item)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/items/${itemTwoUserTree._id}123`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(400);
    // assert response body
    expect(response.body.errorType).toEqual('CastError');
  });

  it('/items (Not owner and not delete item)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/items/${itemOneUserOne._id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(itemForCreate)
      .expect(400);
    // assert response body
    expect(response.body.errorMessage).toEqual('Not owner');
  });
});
