/* PROJECT LICENSE */

import { StorageClient } from '../storage/storageclient';
import { User } from '../../models/User';
/**
 * Name of the completions table.
 */
export const USERS_TABLE = 'USERS';

export async function userCreate(user: User): Promise<User> {
  try {
    const storageCli = StorageClient.getInstance();
    const [result, fields] = await storageCli.persistentStorageConnection!.query(
      'INSERT INTO ' + USERS_TABLE + ' (email) VALUES (?)',
      [user.email]);

    const [rows] = await storageCli.persistentStorageConnection!.query(
      'SELECT id FROM ' + USERS_TABLE + ' WHERE email = ?',
      [user.email]);

    return {
      email: user.email,
      id: (rows as User[])[0].id!,
    };
  } catch (err) {
    throw err;
  }
}
