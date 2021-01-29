import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { connectWithRetry } from './fixtures/mongooseInit';
import { SetupDatabase, userTree } from './fixtures/db';

describe('authController (e2e)', () => {
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

  it('/auth/login (login and create new token)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userTree.email,
        password: userTree.password,
      })
      .expect(200);
    // assert response body
    expect(response.body.access_token).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  it('/auth/login (login Unauthorized bad email)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'bad email',
        password: userTree.password,
      })
      .expect(401);
    // assert response body
    expect(response.body.access_token).toBeUndefined();
    expect(response.body.errorMessage).toEqual('Unauthorized');
  });

  it('/auth/login (login Unauthorized bad password)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userTree.email,
        password: 'bad password',
      })
      .expect(401);
    // assert response body
    expect(response.body.access_token).toBeUndefined();
    expect(response.body.errorMessage).toEqual('Unauthorized');
  });

  it('/auth/refresh (Get refresh token)', async () => {
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
    const access_token = response1.body.access_token;
    const refreshToken = response1.body.refreshToken;
    const response2 = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        refreshToken: refreshToken,
      })
      .expect(200);
    // assert response body
    expect(response2.body.access_token).toBeDefined();
    expect(response2.body.refreshToken).toBeDefined();
  });

  it('/auth/refresh (Required access_token unauthorized and not get refresh token)', async () => {
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
    const refreshToken = response1.body.refreshToken;
    const response2 = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        refreshToken: refreshToken,
      })
      .expect(401);
    // assert response body
    expect(response2.body.access_token).toBeUndefined();
    expect(response2.body.errorMessage).toEqual('Unauthorized');
  });

  it('/auth/refresh (Required refreshToken and not get refresh token)', async () => {
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
    const access_token = response1.body.access_token;
    const response2 = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400);
    // assert response body
    expect(response2.body.access_token).toBeUndefined();
    expect(response2.body.errorMessage).toEqual('Bad Request: required fields');
  });
});
