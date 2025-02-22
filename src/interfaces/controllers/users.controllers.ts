/* PROJECT LICENSE */

import { NextFunction, Request, Response } from 'express';
import { User } from '../../models/User';
import { UserPresenter } from '../presenters/UserPresenter';
import { sendCreated } from './responses.utils';
import { userCreate } from '../../infrastructure/repositories/users.repository';

export async function createUser(req: Request<unknown, unknown, User>, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const user = new User(req.body);
    const responseBody: UserPresenter = {
      data: await userCreate(user) as Required<User>,
      success: true,
    };
    return sendCreated(res, responseBody);
  } catch (err: unknown) {
    return next(err);
  }
};
