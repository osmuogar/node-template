/* PROJECT LICENSE */

import { USERS_TABLE } from '../../../src/infrastructure/repositories/users.repository';
import mysql from 'mysql2/promise';

export async function cleanDatabase(connection: mysql.Connection): Promise<void> {
  await connection.query('DELETE FROM ' + USERS_TABLE);
}
