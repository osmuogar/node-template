/* PROJECT LICENSE */

import { Request, Response } from 'express';
import { sendBadRequest, sendServerError } from './responses.utils';
import { InvalidParamError } from '../../util/InvalidParamError';

export function expressErrorHandler(err: Error, req: Request, res: Response): Response {
  switch (err.name) {
    case InvalidParamError.name:
      return sendBadRequest(res, {
        message: err.message,
        success: false,
      });
    default:
      return sendServerError(res, err);
  }
}
