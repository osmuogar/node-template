/* PROJECT LICENSE */

import { Completion } from '../../models/Completion';
import { StorageClient } from '../storage/storageclient';

/**
 * Name of the completions table.
 */
export const COMPLETIONS_TABLE = 'COMPLETIONS';

export async function completionCreate(completion: Completion): Promise<Completion> {
  const storageCli = StorageClient.getInstance();
  // If there is an instance of the module, this invalidates the stored value
  await storageCli.volatileStorageConnection?.del(completion.userId + '.' + completion.moduleId);

  const [result, fields] = await storageCli.persistentStorageConnection!.query(
    'INSERT INTO ' + COMPLETIONS_TABLE + ' (userId, lessonId) VALUES (?, ?)',
    [completion.userId, completion.lessonId]);

  const [rows] = await storageCli.persistentStorageConnection!.query(
    'SELECT id FROM ' + COMPLETIONS_TABLE + ' WHERE userId = ? AND lessonId = ? ',
    [completion.userId, completion.lessonId]);

  return {
    id: (rows as Completion[])[0].id,
    lessonId: (rows as Completion[])[0].lessonId,
    userId: (rows as Completion[])[0].userId,
  };
}
