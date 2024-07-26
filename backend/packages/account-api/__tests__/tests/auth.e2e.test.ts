import request from 'supertest';

import app from '../../src/app';
import { setupDb, setupTestKafka } from '../helpers/test-helpers';

import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Account } from '../../src/entities/account.entity';

import bcrypt from 'bcrypt';
import { User } from '../../src/entities/user.entity';
import { getDataSource } from '../../src/repository/auth.datasource';
import { StartedKafkaContainer } from '@testcontainers/kafka';

describe('Auth Controller', () => {
  let db: StartedPostgreSqlContainer;
  let kafka: StartedKafkaContainer;
  beforeEach(async () => {
    db = await setupDb();
    kafka = await setupTestKafka();
  }, 10000);

  afterEach(async () => {
    await db.stop();
    await kafka.stop();
  });

  describe('Testing login functionality', () => {
    it('should return a session token', async () => {
      // Arrange
      const payload = {
        email: 'testuser@gmail.com',
        password: 'Awesomepa$$123',
      };

      // Create an account
      const hashedPassword = bcrypt.hashSync(payload.password, 3);
      const accountRepo = getDataSource().getRepository(Account);
      const userRepo = getDataSource().getRepository(User);

      const user = await userRepo.save(
        userRepo.create({
          email: payload.email,
          name: 'Awesome Name',
        }),
      );

      await accountRepo.save(
        accountRepo.create({
          username: payload.email,
          password: hashedPassword,
          user: Promise.resolve(user),
        }),
      );

      // Act
      const res = await request(app).post('/auth/login').send({
        email: 'testuser@gmail.com',
        password: 'Awesomepa$$123',
      });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.sessionToken).toBeDefined();
    }, 100000);

    it('should fail email validation', async () => {
      const res = await request(app).post('/auth/login').send({
        password: 'awesomepass',
      });

      expect(res.status).toBe(400);
    });

    it('should fail password validation', async () => {
      const payload = {
        email: 'testuser@gmail.com',
      };

      const res = await request(app).post('/auth/login').send(payload);
      expect(res.status).toBe(400);
    });
  });

  describe('Testing registration functionality', () => {
    it('should return a session token', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'awesome.test+1@gmail.com',
        password: 'mTtestssasogjsaokgsad$//a2@12',
        name: 'Test Account',
      });
      expect(res.status).toBe(201);
    }, 10000);

    it('should fail email validation', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'bad-email',
        password: 'awesomepass',
        name: 'Awesome Name',
      });

      expect(res.status).toBe(400);
    });

    it('should fail password validation', async () => {
      const payload = {
        email: 'testuser@gmail.com',
        password: 'notstrongenough',
        name: 'Awesome Name',
      };

      const res = await request(app).post('/auth/register').send(payload);
      expect(res.status).toBe(400);
    });

    it('should fail name validation', async () => {
      const payload = {
        email: 'testuser@gmail.com',
        password: 'notstrongenough',
        name: 123,
      };

      const res = await request(app).post('/auth/register').send(payload);
      expect(res.status).toBe(400);
    });
  });
});
