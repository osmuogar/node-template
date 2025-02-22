/* PROJECT LICENSE */

import axios, { AxiosError, AxiosResponse } from 'axios';
import { deepEqual, fail, strictEqual } from 'assert';
import { PageablePresenter } from '../../src/interfaces/presenters/PageablePresenter';
import { Server } from '../../src/Server';
import { User } from '../../src/models/User';
import { UserPresenter } from '../../src/interfaces/presenters/UserPresenter';
import { cleanDatabase } from './util/cleandatabase.utils';
import mysql from 'mysql2/promise';
import { testUtilCreateUser } from './util/createuser.util';

const DB_NAME = 'MY_DATABASE';
const DB_HOST = 'localhost';
const DB_PORT = 3306;
const DB_USER = 'test';
const DB_PASSWORD = 'test';

const REDIS_HOST = 'localhost';
const REDIS_PORT = 6379;

const HTTP_HOST = 'localhost';
const HTTP_PORT = 3000;

describe('Users', function () {
  let storageConnection: mysql.Connection;
  let server: Server;
  this.beforeAll(async () => {
    server = new Server({
      http: {
        port: 3000,
      },
      mysql: {
        databaseName: DB_NAME,
        host: DB_HOST,
        password: DB_PASSWORD,
        poolConnectionLimit: 10,
        poolMaxConnectionLifeTime: 0,
        poolMaxIdleConnections: 5,
        poolMaxIdleTime: 60000,
        poolQueueLimit: 0,
        port: DB_PORT,
        user: DB_USER,
        waitForConnections: true,
      },
      redis: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
    });
    await server.listen();

    storageConnection = await mysql.createConnection({
      database: DB_NAME,
      host: DB_HOST,
      password: DB_PASSWORD,
      user: DB_USER,
    });
  });
  this.afterAll(async () => {
    await storageConnection.end();
    await server.close();
  });
  const PATH = '/v1/users/';
  describe('/v1/users/', function () {
    describe('POST', function () {
      this.afterEach(async () => {
        await cleanDatabase(storageConnection);
      });
      it('should register the user', async () => {
        const EMAIL = 'email@example.com';
        const URL = 'http://' + HTTP_HOST + ':' + HTTP_PORT + PATH;

        await axios.post<never, AxiosResponse<UserPresenter, unknown>, User>(URL, {
          email: EMAIL,
        }).then(function (response) {
          deepEqual(response.data, {
            data: {
              email: EMAIL,
              id: response.data.data.id,
            },
            success: true,
          });
          strictEqual(response.status, 201);
        }).catch(function (error: Error) {
          if (error instanceof AxiosError) { }
          fail(error);
        });
      });
      it('should return 400 if the email is missing', async () => {
        const URL = 'http://' + HTTP_HOST + ':' + HTTP_PORT + PATH;

        await axios.post<never, AxiosResponse<UserPresenter, unknown>, User>(URL, {
          email: '',
        }).then(function () {
          fail('Expected 400 status code');
        }).catch(function (error: AxiosError) {
          if (error instanceof AxiosError) { }
          strictEqual(error.response?.status, 400);
          deepEqual(error.response.data, {
            message: 'Invalid User email.',
            success: false,
          });
        });
      });
    });
    describe('GET', function () {
      const users: User[] = [];
      this.beforeAll(async () => {
        users.push(await testUtilCreateUser(storageConnection, 'a.example@mail.com'));
        users.push(await testUtilCreateUser(storageConnection, 'b.example@mail.com'));
        users.push(await testUtilCreateUser(storageConnection, 'c.example@mail.com'));
        users.push(await testUtilCreateUser(storageConnection, 'd.example@mail.com'));
      });
      this.afterAll(async () => {
        await cleanDatabase(storageConnection);
      });
      it('should list available users', async () => {
        const URL = 'http://' + HTTP_HOST + ':' + HTTP_PORT + PATH;

        await axios.get<never, AxiosResponse<PageablePresenter, unknown>, User>(URL)
          .then(function (response) {
            deepEqual(response.data, {
              items: users,
              page: 0,
              perPage: 10,
              success: true,
            });
            strictEqual(response.status, 200);
          }).catch(function (error: Error) {
            if (error instanceof AxiosError) { }
            fail(error);
          });
      });
      it('should limit users to perPage', async () => {
        const PER_PAGE = 2;
        const URL = 'http://' + HTTP_HOST + ':' + HTTP_PORT + PATH + '?perPage=' + PER_PAGE;

        await axios.get<never, AxiosResponse<PageablePresenter, unknown>, User>(URL)
          .then(function (response) {
            deepEqual(response.data, {
              items: [users[0], users[1]],
              page: 0,
              perPage: PER_PAGE,
              success: true,
            });
            strictEqual(response.status, 200);
          }).catch(function (error: Error) {
            if (error instanceof AxiosError) { }
            fail(error);
          });
      });
      it('should show second page', async () => {
        const PER_PAGE = 2;
        const PAGE = 1;
        const URL = 'http://' + HTTP_HOST + ':' + HTTP_PORT + PATH + '?perPage=' + PER_PAGE + '&page=' + PAGE;

        await axios.get<never, AxiosResponse<PageablePresenter, unknown>, User>(URL)
          .then(function (response) {
            deepEqual(response.data, {
              items: [users[2], users[3]],
              page: PAGE,
              perPage: PER_PAGE,
              success: true,
            });
            strictEqual(response.status, 200);
          }).catch(function (error: Error) {
            if (error instanceof AxiosError) { }
            fail(error);
          });
      });
    });
  });
  describe('/v1/users/:userId', function () {
    let user: User;
    this.beforeEach(async () => {
      user = await testUtilCreateUser(storageConnection, 'a.example@mail.com');
    });
    this.afterEach(async () => {
      await cleanDatabase(storageConnection);
    });
    describe('GET', function () {
      it('should retrieve the user', async () => {
        const URL = 'http://' + HTTP_HOST + ':' + HTTP_PORT + PATH + '/' + user.id;

        await axios.get<never, AxiosResponse<UserPresenter, unknown>, User>(URL)
          .then(function (response) {
            deepEqual(response.data, {
              data: {
                email: user.email,
                id: user.id,
              },
              success: true,
            });
            strictEqual(response.status, 200);
          }).catch(function (error: Error) {
            if (error instanceof AxiosError) { }
            fail(error);
          });
      });
      it('should return 404 if the user doesn\'t exists', async () => {
        const URL = 'http://' + HTTP_HOST + ':' + HTTP_PORT + PATH + '/random';

        await axios.get<never, AxiosResponse<UserPresenter, unknown>, User>(URL)
          .then(function () {
            fail('Expected 404 status code');
          }).catch(function (error: AxiosError) {
            if (error instanceof AxiosError) { }
            strictEqual(error.response?.status, 404);
            deepEqual(error.response.data, {
              message: 'Not found.',
              success: false,
            });
          });
      });
    });
    describe('POST', function () {
      it('should update the user', async () => {
        const URL = 'http://' + HTTP_HOST + ':' + HTTP_PORT + PATH + '/' + user.id;
        const NEW_EMAIL = 'newEmail@mail.com';
        await axios.post<never, AxiosResponse<UserPresenter, unknown>, User>(URL, {
          email: NEW_EMAIL,
        }).then(function (response) {
          deepEqual(response.data, {
            data: {
              email: NEW_EMAIL,
              id: user.id,
            },
            success: true,
          });
          strictEqual(response.status, 200);
        }).catch(function (error: Error) {
          if (error instanceof AxiosError) { }
          fail(error);
        });
      });
      it('should return 404 if the user doesn\'t exists', async () => {
        const URL = 'http://' + HTTP_HOST + ':' + HTTP_PORT + PATH + '/random';

        await axios.post<never, AxiosResponse<UserPresenter, unknown>, User>(URL, {
          email: 'myNewEmail',
        }).then(function () {
          fail('Expected 404 status code');
        }).catch(function (error: AxiosError) {
          if (error instanceof AxiosError) { }
          strictEqual(error.response?.status, 404);
          deepEqual(error.response.data, {
            message: 'Not found.',
            success: false,
          });
        });
      });
    });
    describe('DELETE', function () {
      it('should delete the user', async () => {
        const URL = 'http://' + HTTP_HOST + ':' + HTTP_PORT + PATH + '/' + user.id;

        await axios.delete<never, AxiosResponse<UserPresenter, unknown>, User>(URL)
          .then(function (response) {
            deepEqual(response.data, {
              success: true,
            });
            strictEqual(response.status, 200);
          }).catch(function (error: Error) {
            if (error instanceof AxiosError) { }
            fail(error);
          });
      });
      it('should return 404 if the user doesn\'t exists', async () => {
        const URL = 'http://' + HTTP_HOST + ':' + HTTP_PORT + PATH + '/random';

        await axios.delete<never, AxiosResponse<UserPresenter, unknown>, User>(URL)
          .then(function () {
            fail('Expected 404 status code');
          }).catch(function (error: AxiosError) {
            if (error instanceof AxiosError) { }
            strictEqual(error.response?.status, 404);
            deepEqual(error.response.data, {
              message: 'Not found.',
              success: false,
            });
          });
      });
    });
  });
});
