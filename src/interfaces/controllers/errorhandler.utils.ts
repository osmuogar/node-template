/* PROJECT LICENSE */

import { NextFunction, Request, Response } from 'express';
import { sendBadRequest, sendNotFound, sendServerError } from './responses.utils';
import { InvalidParamError } from '../../util/InvalidParamError';
import { InvalidReqParamError } from '../../util/InvalidReqParamError';

export function expressErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(err);
  } else {
    switch (err.name) {
      case InvalidParamError.name: // Thrown when model validation fails
        sendBadRequest(res, {
          message: err.message,
          success: false,
        });
        break;
      case InvalidReqParamError.name: // Thrown when request param validation fails
        sendNotFound(res);
        break;
      default:
        sendServerError(res, err);
    }
  }
}
