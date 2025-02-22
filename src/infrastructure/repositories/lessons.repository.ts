/* PROJECT LICENSE */

import { COMPLETIONS_TABLE } from './completions.repository';
import { Completion } from '../../models/Completion';
import { Lesson } from '../../models/Lesson';
import { LessonResponseDTO } from '../../interafaces/controllers/lessons.controllers';
import { StorageClient } from '../storage/storageclient';

/**
 * name of the lessons table.
 */
export const LESSONS_TABLE = 'LESSONS';

export async function lessonCreate(userId: string, lesson: Lesson): Promise<LessonResponseDTO> {
  const storageCli = StorageClient.getInstance();

  // If there is an instance of the module, this invalidates the stored value
  // await storageCli.volatileStorageConnection?.del(userId + '.' + lesson.moduleId);

  const [result, fields] = await storageCli.persistentStorageConnection!.query(
    'INSERT INTO ' + LESSONS_TABLE + ' (id, moduleId, title) VALUES (?, ?, ?)',
    [lesson.id, lesson.moduleId, lesson.title]
  );
  const [rows] = await storageCli.persistentStorageConnection!.query(
    'SELECT id FROM ' + LESSONS_TABLE + ' WHERE moduleId = ? AND title = ? ',
    [lesson.moduleId, lesson.title]);

  return {
    id: (rows as Lesson[])[0].id!,
    isCompleted: false,
    moduleId: lesson.moduleId,
    title: lesson.title,
  };
}

export async function lessonRead(userId: string, lessonId: string): Promise<LessonResponseDTO> {
  const storageCli = StorageClient.getInstance();
  const [rows] = await storageCli.persistentStorageConnection!.query(
    'SELECT ' + LESSONS_TABLE + '.id, ' +
    LESSONS_TABLE + '.title, ' +
    LESSONS_TABLE + '.moduleId, ' +
    COMPLETIONS_TABLE + '.userId ' +
    'FROM ' + LESSONS_TABLE +
    ' LEFT JOIN ' + COMPLETIONS_TABLE + ' ' +
    'ON ' +
    LESSONS_TABLE + '.id = ' + COMPLETIONS_TABLE + '.lessonId ' +
    'WHERE LESSONS.id = ? AND ( userId = ? OR userId IS NULL)',
    [lessonId, userId]
  );

  return {
    id: (rows as Lesson[])[0].id!,
    isCompleted: (rows as Completion[])[0].userId ? true : false,
    moduleId: (rows as Lesson[])[0].moduleId,
    title: (rows as Lesson[])[0].title,
  };
}

export async function lessonList(userId: string, courseId: string, moduleId: string, limit: number, offset: number): Promise<LessonResponseDTO[]> {
  const storageCli = StorageClient.getInstance();
  const [rows] = await storageCli.persistentStorageConnection!.query(
    'SELECT ' + LESSONS_TABLE + '.id, ' +
    LESSONS_TABLE + '.title, ' +
    LESSONS_TABLE + '.moduleId, ' +
    COMPLETIONS_TABLE + '.userId ' +
    'FROM ' + LESSONS_TABLE +
    ' LEFT JOIN ' + COMPLETIONS_TABLE + ' ' +
    'ON ' +
    LESSONS_TABLE + '.id = ' + COMPLETIONS_TABLE + '.lessonId ' +
    'AND ' +
    COMPLETIONS_TABLE + '.userId = ? AND ' + LESSONS_TABLE + '.moduleId = ?' +
    'ORDER BY title ASC LIMIT ' + limit + ' OFFSET ' + offset,
    [userId, moduleId]
  );

  return (rows as (Lesson & Completion)[]).map((item) => {
    return {
      id: item.id!,
      isCompleted: item.userId ? true : false,
      moduleId: item.moduleId,
      title: item.title,
    };
  });
}
