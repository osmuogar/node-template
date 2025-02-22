/* PROJECT LICENSE */

import { LESSONS_TABLE, lessonRead } from './lessons.repository';
import { ModuleResponseDTO, ModuleResponsePopulatedDTO } from '../../interafaces/controllers/modules.controllers';
import { Module } from '../../models/Module';
import { StorageClient } from '../storage/storageclient';

/**
 * name of the modules table.
 */
export const MODULES_TABLE = 'MODULES';

/**
 * Creates a module in the database.
 */
export async function moduleCreate(userId: string, module: Module): Promise<ModuleResponseDTO> {
  const storageCli = StorageClient.getInstance();
  // If submodule, remove parent module from volatile storage
  await storageCli.volatileStorageConnection?.del(userId + '.' + module.moduleId);
  const [result, fields] = await storageCli.persistentStorageConnection!.query(
    'INSERT INTO ' + MODULES_TABLE + ' (title, isRootModule, moduleId, courseId) ' +
    'VALUES (?, ?, ?, ?)',
    [module.title, module.isRootModule, module.moduleId, module.courseId]
  );
  const [rows] = await StorageClient.getInstance().persistentStorageConnection!.query(
    'SELECT id FROM ' + MODULES_TABLE + ' WHERE courseId = ? AND title = ? ',
    [module.courseId, module.title]);

  return {
    courseId: module.courseId,
    id: (rows as Module[])[0].id!,
    isRootModule: module.isRootModule,
    moduleId: module.moduleId,
    title: module.title,
  };
}

export async function moduleRead(userId: string, moduleId: string): Promise<ModuleResponsePopulatedDTO> {
  const storageCli = StorageClient.getInstance();

  let res: ModuleResponsePopulatedDTO | undefined;

  const cachedValue = await storageCli.volatileStorageConnection?.get(userId + '.' + moduleId);
  if (cachedValue) {
    res = JSON.parse(cachedValue);
  }
  if (!res) {
    const [rows] = await storageCli.persistentStorageConnection!.query(
      'SELECT ' + MODULES_TABLE + '.id, ' +
      MODULES_TABLE + '.title, ' +
      MODULES_TABLE + '.moduleId, ' +
      MODULES_TABLE + '.isRootModule, ' +
      MODULES_TABLE + '.courseId, ' +
      LESSONS_TABLE + '.id as lessonId, ' +
      LESSONS_TABLE + '.title as lessonTitle ' +
      'FROM ' + MODULES_TABLE +
      ' LEFT JOIN ' + LESSONS_TABLE + ' ' +
      'ON ' +
      MODULES_TABLE + '.id = ' + LESSONS_TABLE + '.moduleId ' +
      'WHERE (' +
      MODULES_TABLE + '.id = ? OR ' + MODULES_TABLE + '.moduleId = ?' +
      ') ORDER BY ' + MODULES_TABLE + '.title, ' + LESSONS_TABLE + '.title ASC',
      [moduleId, moduleId]
    );

    const filteredLessons = (rows as (Module & { lessonId: string })[]).filter((row) => {
      return row.lessonId !== null;
    });

    const lessons = await Promise.all(
      filteredLessons.map(async (lesson) => lessonRead(userId, lesson.lessonId))
    );

    const filteredModules = (rows as (Module & { lessonId: string })[]).filter((row) => {
      return row.moduleId !== null && row.id !== moduleId;
    });

    const modules = await Promise.all(
      filteredModules.map(async (module) => moduleRead(userId, module.id!))
    );

    res = {
      courseId: (rows as Module[])[0].courseId,
      id: (rows as Module[])[0].id!,
      isRootModule: (rows as Module[])[0].isRootModule,
      lessons: lessons,
      moduleId: (rows as Module[])[0].moduleId,
      modules: modules,
      title: (rows as Module[])[0].title,
    };
    storageCli.volatileStorageConnection?.set(userId + '.' + moduleId, JSON.stringify(res));
  }

  return res;
}

/**
 * List all root modules related to a course.
 *
 * WARNING: It's required to speak with the stakeholders to clarify this
 * requirement. As we could have nested modules, listing modules is a
 * functionality that seems only reasonable when describing a course.
 *
 * - Use case 1: I'm starting a (one level module course) and would like to list
 *  them all.
 *
 * - Use case 2: If I'm inside a module, it would make sense to list all lessons
 *  (even if a lesson is a module), although it would not make sense to list
 *  nested modules.
 *
 * Implemented case 1.
 */
export async function modulesList(userId: string, courseId: string, limit: number, offset: number): Promise<ModuleResponsePopulatedDTO[]> {
  const storageCli = StorageClient.getInstance();
  const [rows] = await storageCli.persistentStorageConnection!.query(
    'SELECT id, title FROM ' + MODULES_TABLE + ' WHERE courseId = ? AND isRootModule = true ' +
    'ORDER BY title ASC LIMIT ' + limit + ' OFFSET ' + offset,
    [courseId]
  );

  return await Promise.all(
    (rows as Module[]).map(async (moduleId) => moduleRead(userId, moduleId.id!))
  );
}
