/* PROJECT LICENSE */

import { Request, Response } from 'express';
import { sendBadRequest, sendCreated, sendServerError } from './responses.utils';
import { User } from '../../models/User';
import { userCreate } from '../../infrastructure/repositories/users.repository';

export interface UserResponseDTO {
  id: string,
  email: string,
}

export async function createUser(req: Request<unknown, unknown, User>, res: Response): Promise<Response> {
  try {
    const user = new User(req.body);
    const responseBody: UserResponseDTO = await userCreate(user);
    return sendCreated(res, responseBody);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendBadRequest(res, 'error: ' + err.message);
    } else {
      return sendServerError(res, 'error');
    }
  }
};
