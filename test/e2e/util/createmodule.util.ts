/* PROJECT LICENSE */

import mysql from "mysql2/promise";
import { MODULES_TABLE } from "../../../src/infrastructure/repositories/modules.repository";
import Module from "../../../src/models/Module";

export async function testUtilCreateModule(storageConnection: mysql.Connection, title: string, courseId: string, moduleId?: string): Promise<Module> {
  let rows;
  if (moduleId) { // Non root module
    await storageConnection.query("INSERT INTO " + MODULES_TABLE + " (title, isRootModule, moduleId, courseId) " +
      "VALUES ( ?, false, ?, ?)", [title, moduleId, courseId]);
    [rows] = await storageConnection.query("SELECT * FROM " + MODULES_TABLE + " WHERE courseId = ? AND title = ?", [courseId, title]);
  } else { // Root module
    await storageConnection.query("INSERT INTO " + MODULES_TABLE + " (title, isRootModule, courseId) " +
      "VALUES ( ?, true, ?)", [title, courseId]);
    [rows] = await storageConnection.query("SELECT * FROM " + MODULES_TABLE + " WHERE courseId = ? AND title = ?", [courseId, title]);
  }

  return {
    id: (rows as Module[])[0].id,
    title: (rows as Module[])[0].title,
    isRootModule: (rows as Module[])[0].isRootModule,
    moduleId: (rows as Module[])[0].moduleId,
    courseId: (rows as Module[])[0].courseId,
  }
}