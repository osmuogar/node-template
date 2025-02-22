/* PROJECT LICENSE */

import mysql from "mysql2/promise";
import Completion from "../../../src/models/Completion";
import { COMPLETIONS_TABLE } from "../../../src/infrastructure/repositories/completions.repository";

export async function testUtilCreateCompletion(storageConnection: mysql.Connection, userId: string, lessonId: string): Promise<Completion> {
  await storageConnection.query("INSERT INTO " + COMPLETIONS_TABLE + " (userId, lessonId) " +
    "VALUES (?, ?)", [userId, lessonId]);
  const [rows] = await storageConnection.query("SELECT * FROM " + COMPLETIONS_TABLE +
    " WHERE userId = ? AND lessonId = ? ", [userId, lessonId]);

  return {
    id: (rows as Completion[])[0].id,
    userId: (rows as Completion[])[0].userId,
    lessonId: (rows as Completion[])[0].lessonId,
  }
}