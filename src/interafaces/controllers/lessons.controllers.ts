/* PROJECT LICENSE */

import { Request, Response } from 'express';
import { lessonCreate, lessonList, lessonRead } from '../../infrastructure/repositories/lessons.repository';
import { sendBadRequest, sendCreated, sendOk, sendServerError } from './responses.utils';
import { Lesson } from '../../models/Lesson';

export interface LessonResponseDTO {
  id: string;
  title: string;
  moduleId: string;
  isCompleted: boolean;
}

export async function createLesson(req: Request<{
  userId: string,
  courseId: string,
  moduleId: string,
}, unknown, Lesson>, res: Response): Promise<Response> {
  try {
    const lesson = new Lesson({
      ...req.body,
      moduleId: req.params.moduleId,
    });
    const responseBody: LessonResponseDTO = await lessonCreate(
      req.params.userId,
      lesson);
    return sendCreated(res, responseBody);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendBadRequest(res, err.message);
    } else {
      return sendServerError(res, err);
    }
  }
};

export async function getLessonById(req: Request<{
  userId: string,
  courseId: string,
  moduleId: string,
  lessonId: string
}>, res: Response): Promise<Response> {
  try {
    const responseBody: LessonResponseDTO = await lessonRead(
      req.params.userId,
      req.params.lessonId
    );
    return sendOk(res, responseBody);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendBadRequest(res, err.message);
    } else {
      return sendServerError(res, err);
    }
  }
};

export async function getLessons(req: Request<{
  userId: string,
  courseId: string,
  moduleId: string,
}, unknown, unknown, {
  limit: number,
  offset: number
}>, res: Response): Promise<Response> {
  try {
    const responseBody: LessonResponseDTO[] = await lessonList(
      req.params.userId, req.params.courseId, req.params.moduleId, req.query.limit, req.query.offset);
    return sendOk(res, responseBody);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendBadRequest(res, err.message);
    } else {
      return sendServerError(res, err);
    }
  }
};
