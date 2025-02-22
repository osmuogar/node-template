/* PROJECT LICENSE */

import { Request, Response } from 'express';
import { sendAccepted, sendBadRequest, sendServerError } from './responses.utils';
import { Completion } from '../../models/Completion';

export async function createCompletion(req: Request<{
  userId: string,
  courseId: string,
  moduleId: string,
  lessonId: string
}, unknown, Completion>, res: Response): Promise<Response> {
  try {
    return sendAccepted(res);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendBadRequest(res, err.message);
    } else {
      return sendServerError(res, err);
    }
  }
};
