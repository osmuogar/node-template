/* PROJECT LICENSE */

import { Request, Response } from 'express';
import { moduleCreate, moduleRead, modulesList } from '../../infrastructure/repositories/modules.repository';
import { sendBadRequest, sendCreated, sendOk, sendServerError } from './responses.utils';
import { LessonResponseDTO } from './lessons.controllers';
import { Module } from '../../models/Module';

export interface ModuleResponseDTO {
  id: string;
  title: string;
  isRootModule: boolean;
  moduleId: string | undefined;
  courseId: string;
}

export interface ModuleResponsePopulatedDTO extends ModuleResponseDTO {
  lessons: LessonResponseDTO[];
  modules: ModuleResponsePopulatedDTO[];
}

export async function createModule(req: Request<{
  userId: string,
  courseId: string,
  moduleId: string
}, unknown, Module>, res: Response): Promise<Response> {
  try {
    const courseId = req.params.courseId;
    const module = new Module({
      ...req.body,
      courseId,
    });
    const responseBody: ModuleResponseDTO = await moduleCreate(
      req.params.userId, module);
    return sendCreated(res, responseBody);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendBadRequest(res, err.message);
    } else {
      return sendServerError(res, err);
    }
  }
};

export async function getModuleById(req: Request<{
  userId: string,
  courseId: string,
  moduleId: string
}>, res: Response): Promise<Response> {
  try {
    const responseBody: ModuleResponsePopulatedDTO = await moduleRead(
      req.params.userId, req.params.moduleId);
    return sendOk(res, responseBody);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendBadRequest(res, err.message);
    } else {
      return sendServerError(res, err);
    }
  }
};

export async function getModules(req: Request<{
  userId: string,
  courseId: string,
}, unknown, unknown, {
  limit: number,
  offset: number
}>, res: Response): Promise<Response> {
  try {
    const responseBody: ModuleResponsePopulatedDTO[] = await modulesList(
      req.params.userId, req.params.courseId, req.query.limit, req.query.offset
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
