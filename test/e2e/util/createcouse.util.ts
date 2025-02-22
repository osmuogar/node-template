/* PROJECT LICENSE */

import mysql from "mysql2/promise";
import { COURSES_TABLE } from "../../../src/infrastructure/repositories/courses.repository";
import Course from "../../../src/models/Course";

export async function testUtilCreateCourse(storageConnection: mysql.Connection, title: string): Promise<Course> {
  await storageConnection.query("INSERT INTO " + COURSES_TABLE + " (title) VALUES ( ? )", [title]);
  const [rows] = await storageConnection.query("SELECT * FROM " + COURSES_TABLE + " WHERE title = ?", [title]);
  return {
    id: (rows as Course[])[0].id,
    title: (rows as Course[])[0].title,
  }
}