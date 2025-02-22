/* PROJECT LICENSE */

import mysql from 'mysql2/promise';

export async function cleanDatabase(connection: mysql.Connection) {
  await connection.query('DELETE FROM COMPLETIONS');
  await connection.query('DELETE FROM LESSONS');
  await connection.query('DELETE FROM MODULES');
  await connection.query('DELETE FROM COURSES');
  await connection.query('DELETE FROM USERS');
}
