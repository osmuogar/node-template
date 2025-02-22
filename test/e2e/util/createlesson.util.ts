/* PROJECT LICENSE */

import mysql from "mysql2/promise";
import { LESSONS_TABLE } from "../../../src/infrastructure/repositories/lessons.repository";
import Lesson from "../../../src/models/Lesson";

export async function testUtilCreateLesson(storageConnection: mysql.Connection, title: string, moduleId: string): Promise<Lesson> {
  await storageConnection.query("INSERT INTO " + LESSONS_TABLE + " (title, moduleId) " +
    "VALUES (?, ?)", [title, moduleId]);
  const [rows] = await storageConnection.query("SELECT * FROM " + LESSONS_TABLE +
    " WHERE moduleId = ? AND title = ?", [moduleId, title]);

  return {
    id: (rows as Lesson[])[0].id,
    title: (rows as Lesson[])[0].title,
    moduleId: (rows as Lesson[])[0].moduleId,
  }
}