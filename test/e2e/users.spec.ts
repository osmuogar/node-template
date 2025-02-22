/* PROJECT LICENSE */

import axios, { AxiosError, AxiosResponse } from 'axios';
import { deepEqual, fail, strictEqual } from 'assert';
import { Server } from '../../src/Server';
import { User } from '../../src/models/User';
import { UserPresenter } from '../../src/interfaces/presenters/UserPresenter';
import { cleanDatabase } from './util/cleandatabase.utils';
import mysql from 'mysql2/promise';

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
  describe('POST /v1/users/', () => {
    afterEach(async () => {
      await cleanDatabase(storageConnection);
    });
    it('should register the user', async () => {
      const PATH = '/v1/users/';
      const EMAIL = 'email@example.com';

      const URL = 'http://' + HTTP_HOST + ':' + HTTP_PORT + PATH;

      await axios.post<never, AxiosResponse<UserPresenter, unknown>, User>(URL, {
        email: EMAIL,
      }).then(function (response) {
        deepEqual(response.data.data, {
          email: EMAIL,
          id: response.data.data.id,
        });
        strictEqual(response.status, 201);
      }).catch(function (error: Error) {
        if (error instanceof AxiosError) { }
        fail(error);
      });
    });
  });
});
