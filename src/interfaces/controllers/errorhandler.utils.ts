/* PROJECT LICENSE */

import { NextFunction, Request, Response } from 'express';
import { sendBadRequest, sendServerError } from './responses.utils';
import { InvalidParamError } from '../../util/InvalidParamError';

export function expressErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(err);
  } else {
    switch (err.name) {
      case InvalidParamError.name:
        sendBadRequest(res, {
          message: err.message,
          success: false,
        });
        break;
      default:
        sendServerError(res, err);
    }
  }
}
