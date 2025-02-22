/* PROJECT LICENSE */

import { CourseResponseDTO, CourseResponsePopulatedDTO } from '../../interafaces/controllers/courses.controllers';
import { MODULES_TABLE, modulesList } from './modules.repository';
import { COMPLETIONS_TABLE } from './completions.repository';
import { Course } from '../../models/Course';
import { LESSONS_TABLE } from './lessons.repository';
import { StorageClient } from '../storage/storageclient';

/**
 * Name of the courses table.
 */
export const COURSES_TABLE = 'COURSES';

/**
 * Creates a course in the storage.
 */
export async function courseCreate(userId: string, course: Course): Promise<CourseResponseDTO> {
  const storageCli = StorageClient.getInstance();
  const [result, fields] = await storageCli.persistentStorageConnection!.query(
    'INSERT INTO ' + COURSES_TABLE + ' (title) VALUES (?)',
    [course.title]);

  const [rows] = await storageCli.persistentStorageConnection!.query(
    'SELECT id FROM ' + COURSES_TABLE + ' WHERE title = ?',
    [course.title]);

  return {
    completion: {
      completedLessons: 0,
      percentage: 0,
      totalLessons: 0,
    },
    id: (rows as Course[])[0].id!,
    title: course.title,
  };
}
/**
 * Returns a detailed information of a course.
 */
export async function courseRead(userId: string, courseId: string): Promise<CourseResponsePopulatedDTO> {
  const storageCli = StorageClient.getInstance();
  const [totalLessons] = await storageCli.persistentStorageConnection!.query(
    'SELECT ' +
    COURSES_TABLE + '.id as courseId, ' +
    COURSES_TABLE + '.title as title, ' +
    MODULES_TABLE + '.id as moduleId, ' +
    LESSONS_TABLE + '.id as lessonId ' +
    'FROM ' + COURSES_TABLE + ' ' +
    'INNER JOIN ' + MODULES_TABLE + ' ' +
    'ON ' + COURSES_TABLE + '.id = ' + MODULES_TABLE + '.courseId ' +
    'INNER JOIN ' + LESSONS_TABLE + ' ' +
    'ON ' + MODULES_TABLE + '.id = ' + LESSONS_TABLE + '.moduleId ' +
    'WHERE ' + COURSES_TABLE + '.id = ?', [courseId]
  );

  const [completedLessons] = await storageCli.persistentStorageConnection!.query(
    'SELECT ' +
    COURSES_TABLE + '.id as courseId, ' +
    MODULES_TABLE + '.id as moduleId, ' +
    LESSONS_TABLE + '.id as lessonId, ' +
    COMPLETIONS_TABLE + '.userId as userId ' +
    'FROM ' + COURSES_TABLE + ' ' +
    'INNER JOIN ' + MODULES_TABLE + ' ' +
    'ON ' + COURSES_TABLE + '.id = ' + MODULES_TABLE + '.courseId ' +
    'INNER JOIN ' + LESSONS_TABLE + ' ' +
    'ON ' + MODULES_TABLE + '.id = ' + LESSONS_TABLE + '.moduleId ' +
    'RIGHT JOIN ' + COMPLETIONS_TABLE + ' ' +
    'ON ' + LESSONS_TABLE + '.id = ' + COMPLETIONS_TABLE + '.lessonId ' +
    'WHERE ' + COURSES_TABLE + '.id = ?', [courseId]
  );

  return {
    completion: {
      completedLessons: (completedLessons as []).length,
      percentage: 100 * (completedLessons as []).length / (totalLessons as []).length,
      totalLessons: (totalLessons as []).length
    },
    id: (totalLessons as Course[])[0].id!,
    modules: await modulesList(userId, courseId, 10, 0),
    title: (totalLessons as Course[])[0].title,
  };
}
/**
 * Returns a paginated list of available courses.
 */
export async function courseList(userId: string, limit: number, offset: number): Promise<CourseResponsePopulatedDTO[]> {
  const storageCli = StorageClient.getInstance();
  const [rows] = await storageCli.persistentStorageConnection!.query(
    'SELECT * FROM ' + COURSES_TABLE +
    ' ORDER BY title ASC ' +
    'LIMIT ' + limit + ' OFFSET ' + offset
  );

  return await Promise.all(
    (rows as Course[]).map(async (course) => await courseRead(userId, course.id!))
  );
}
