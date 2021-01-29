import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { connectWithRetry } from './fixtures/mongooseInit';
import { SetupDatabase, userOne, userTwoForCreate } from './fixtures/db';

describe('userController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    await connectWithRetry();
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

  it('/users (Create new user)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userTwoForCreate)
      .expect(201);
    // assert response body
    expect(response.body.email).toEqual(userTwoForCreate.email);
    expect(response.body.name).toEqual(userTwoForCreate.name);
    expect(response.body.password).toBeUndefined();
    expect(response.body._id).toBeDefined();
  });

  it('/users (Required filed name ValidationError and do not Create new user)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: userTwoForCreate.email,
        password: userTwoForCreate.password,
      })
      .expect(400);
    // assert response body
    expect(response.body.errorType).toEqual('ValidationError');
  });

  it('/users (Required filed email ValidationError and do not Create new user)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: userTwoForCreate.name,
        password: userTwoForCreate.password,
      })
      .expect(400);
    // assert response body
    expect(response.body.errorType).toEqual('ValidationError');
  });

  it('/users (Required filed password ValidationError and do not Create new user)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: userTwoForCreate.name,
        email: userTwoForCreate.email,
      })
      .expect(400);
    // assert response body
    expect(response.body.errorType).toEqual('ValidationError');
  });

  it('/users (findAll users)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);
    // assert response body
    expect(response.body).toHaveLength(2);
  });

  it('/users (findOne user)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userOne._id}`)
      .expect(200);
    // assert response body
    expect(response.body._id).toEqual(userOne._id);
    expect(response.body.email).toEqual(userOne.email);
    expect(response.body.name).toEqual(userOne.name);
    expect(response.body.password).toBeUndefined();
  });

  it('/users (Cast to ObjectId failed findOne user)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userOne._id}123`)
      .expect(400);
    // assert response body
    expect(response.body.errorType).toEqual('CastError');
  });

  it('/users (Not found failed findOne user)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/6012d781868068d2fe8057da')
      .expect(404);
    // assert response body
    expect(response.body.errorMessage).toEqual('User not found');
  });

  it('/users (update user)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/users/${userOne._id}`)
      .send({
        name: userTwoForCreate.name,
        email: userTwoForCreate.email,
      })
      .expect(200);
    // assert response body
    expect(response.body._id).toEqual(userOne._id);
    expect(response.body.email).toEqual(userTwoForCreate.email);
    expect(response.body.name).toEqual(userTwoForCreate.name);
    expect(response.body.password).toBeUndefined();
  });

  it('/users (Cast to ObjectId failed update user)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/users/${userOne._id}123`)
      .send({
        name: userTwoForCreate.name,
        email: userTwoForCreate.email,
      })
      .expect(400);
    // assert response body
    expect(response.body.errorType).toEqual('CastError');
  });

  it('/users (Not found failed update user)', async () => {
    const response = await request(app.getHttpServer())
      .put('/users/6012d781868068d2fe8057da')
      .send({
        name: userTwoForCreate.name,
        email: userTwoForCreate.email,
      })
      .expect(404);
    // assert response body
    expect(response.body.errorMessage).toEqual('User not found');
  });

  it('/users (delete user)', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userOne._id}`)
      .expect(204);
  });

  it('/users (Cast to ObjectId failed delete user)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${userOne._id}123`)
      .expect(400);
    // assert response body
    expect(response.body.errorType).toEqual('CastError');
  });

  it('/users (Not found failed delete user)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/users/6012d781868068d2fe8057da')
      .expect(404);
    // assert response body
    expect(response.body.errorMessage).toEqual('User not found');
  });
});
