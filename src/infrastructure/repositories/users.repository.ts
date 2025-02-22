/* PROJECT LICENSE */

import { ResultSetHeader } from 'mysql2';
import { StorageClient } from '../storage/storageclient';
import { User } from '../../models/User';

/**
 * Name of the users table.
 */
export const USERS_TABLE = 'USERS';

export async function userRead(userId: string): Promise<User | undefined> {
  const storageCli = StorageClient.getInstance();
  const [rows] = await storageCli.persistentStorageConnection!.query(
    'SELECT * FROM ' + USERS_TABLE + ' WHERE id = ?', [userId]
  );
  if ((rows as User[]).length === 0) {
    return undefined;
  }
  return {
    email: (rows as User[])[0].email,
    id: userId,
  };
}

export async function userCreate(user: User): Promise<User> {
  const storageCli = StorageClient.getInstance();
  const result = await storageCli.persistentStorageConnection!.query(
    'INSERT INTO ' + USERS_TABLE + ' (email) VALUES (?)',
    [user.email]
  );
  if ((result[0] as ResultSetHeader).affectedRows === 0) {
    throw new Error('Error creating user in the database');
  }
  const [rows] = await storageCli.persistentStorageConnection!.query(
    'SELECT id FROM ' + USERS_TABLE + ' WHERE email = ?',
    [user.email]
  );
  return {
    email: user.email,
    id: (rows as User[])[0].id!,
  };
}

export async function userDelete(userId: string): Promise<boolean> {
  const storageCli = StorageClient.getInstance();
  const result = await storageCli.persistentStorageConnection!.query(
    'DELETE FROM ' + USERS_TABLE + ' WHERE id = ?',
    [userId]
  );
  return (result[0] as ResultSetHeader).affectedRows === 0 ? false : true;
}

export async function userUpdate(user: User): Promise<User | undefined> {
  const storageCli = StorageClient.getInstance();
  const result = await storageCli.persistentStorageConnection!.query(
    'UPDATE ' + USERS_TABLE + ' SET email = ? WHERE id = ?',
    [user.email, user.id]
  );
  if ((result[0] as ResultSetHeader).affectedRows === 0) {
    return undefined;
  }
  return user;
}

export async function userList(perPage: number, page: number): Promise<User[]> {
  const storageCli = StorageClient.getInstance();
  const [rows] = await storageCli.persistentStorageConnection!.query(
    'SELECT * FROM ' + USERS_TABLE + ' ' +
    'ORDER BY email ASC LIMIT ' + perPage + ' OFFSET ' + (page * perPage)
  );
  return rows as Required<User>[];
}

export async function userCount(): Promise<number> {
  const storageCli = StorageClient.getInstance();
  const [countRows] = await storageCli.persistentStorageConnection!.query(
    'SELECT COUNT(*) FROM ' + USERS_TABLE
  );
  return (countRows as { totalCount: number }[])[0].totalCount;
}
