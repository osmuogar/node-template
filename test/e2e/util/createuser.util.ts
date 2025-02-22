/* PROJECT LICENSE */

import { USERS_TABLE } from '../../../src/infrastructure/repositories/users.repository';
import { User } from '../../../src/models/User';
import mysql from 'mysql2/promise';

export async function testUtilCreateUser(storageConnection: mysql.Connection): Promise<User> {
  await storageConnection.query('INSERT INTO ' + USERS_TABLE + ' (email) VALUES ( "course@email.com" )');
  const [rows] = await storageConnection.query('SELECT * FROM ' + USERS_TABLE + ' WHERE email = "course@email.com"');
  return {
    email: (rows as User[])[0].email,
    id: (rows as User[])[0].id,
  };
}
