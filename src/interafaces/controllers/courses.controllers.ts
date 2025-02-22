/* PROJECT LICENSE */

import { ModuleResponseDTO, ModuleResponsePopulatedDTO } from './modules.controllers';
import { Request, Response } from 'express';
import { courseCreate, courseList, courseRead } from '../../infrastructure/repositories/courses.repository';
import { sendBadRequest, sendCreated, sendOk, sendServerError } from './responses.utils';
import { Course } from '../../models/Course';

export interface CourseResponseDTO {
  id: string;
  title: string;
  completion: {
    totalLessons: number;
    completedLessons: number;
    percentage: number;
  }
}

export interface CourseResponsePopulatedDTO extends CourseResponseDTO {
  modules: (ModuleResponseDTO | ModuleResponsePopulatedDTO)[];
}

// POST /users/:userId/courses/
export async function createCourse(req: Request<{ userId: string }, unknown, Course>, res: Response): Promise<Response> {
  try {
    const userId = req.params.userId;
    const course = new Course(req.body);
    const responseBody: CourseResponseDTO = await courseCreate(userId, course);
    return sendCreated(res, responseBody);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendBadRequest(res, err.message);
    } else {
      return sendServerError(res, err);
    }
  }
};

// GET /users/:userId/courses/:courseId
export async function getCourseById(req: Request<{ userId: string, courseId: string }>, res: Response): Promise<Response> {
  try {
    const userId = req.params.userId;
    const responseBody: CourseResponsePopulatedDTO = await courseRead(userId, req.params.courseId);
    return sendOk(res, responseBody);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendBadRequest(res, err.message);
    } else {
      return sendServerError(res, err);
    }
  }
};

// GET /users/:userId/courses/
export async function getCourses(req: Request<{ userId: string }, undefined, undefined, { limit: number, offset: number }>, res: Response): Promise<Response> {
  try {
    const responseBody: CourseResponsePopulatedDTO[] = await courseList(req.params.userId, req.query.limit, req.query.offset);
    return sendOk(res, responseBody);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendBadRequest(res, err.message);
    } else {
      return sendServerError(res, err);
    }
  }
};
