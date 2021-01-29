import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { AppModule } from './../src/app.module';
import { connectWithRetry } from './fixtures/mongooseInit';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await connectWithRetry();
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Shopping Home Page');
  });
});
