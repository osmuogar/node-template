/* PROJECT LICENSE */

import { NextFunction, Request, Response } from 'express';
import { sendCreated, sendOk } from './responses.utils';
import { userCount, userCreate, userDelete, userList, userRead, userUpdate } from '../../infrastructure/repositories/users.repository';
import { InvalidReqParamError } from '../../util/InvalidReqParamError';
import { PageablePresenter } from '../presenters/PageablePresenter';
import { RequestPresenter } from '../presenters/RequestPresenter';
import { User } from '../../models/User';
import { UserPresenter } from '../presenters/UserPresenter';

export async function readUser(req: Request<{ userId: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw new InvalidReqParamError('readUser', 'userId');
    }

    const databaseUser = await userRead(userId) as Required<User>;
    if (!databaseUser) {
      throw new InvalidReqParamError('readUser', 'userId');
    }

    const responseBody: UserPresenter = {
      data: databaseUser,
      success: true,
    };
    res.json(responseBody);
  } catch (err: unknown) {
    next(err);
  }
}

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

export async function updateUser(req: Request<{ userId: string }, unknown, User>, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw new InvalidReqParamError('updateUser', 'userId');
    }
    const user = new User({
      ...req.body,
      id: userId,
    });

    const operationResult = await userUpdate(user);
    if (!operationResult) {
      throw new InvalidReqParamError('updateUser', 'userId');
    }

    const responseBody: UserPresenter = {
      data: operationResult as Required<User>,
      success: true,
    };
    return sendOk(res, responseBody);
  } catch (err: unknown) {
    next(err);
  }
}

export async function deleteUser(req: Request<{ userId: string }>, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const userId = req.params.userId;
    if (!userId) { // Undefined userId
      throw new InvalidReqParamError('deleteUser', 'userId');
    }
    const successOperation = await userDelete(userId);
    if (!successOperation) { // User was not found at the database
      throw new InvalidReqParamError('deleteUser', 'userId');
    }
    const responseBody: RequestPresenter = {
      success: true,
    };
    return sendOk(res, responseBody);
  } catch (err: unknown) {
    next(err);
  }
}

export async function listUsers(req: Request<unknown, unknown, unknown, { perPage: string, page: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 0;
    const responseBody: PageablePresenter = {
      items: await userList(perPage, page) as Required<User>[],
      page,
      perPage,
      success: true,
      total: await userCount(),
    };
    res.json(responseBody);
  } catch (err: unknown) {
    next(err);
  }
}
