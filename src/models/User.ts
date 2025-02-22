/* PROJECT LICENSE */

import { InvalidParamError } from '../util/InvalidParamError';

/**
 * System User.
 */
export class User {
  /**
   * Identifier of the user in the system.
   */
  id?: string;
  /**
   * User's email.
   */
  email: string;

  /**
   * @param user - User data.
   */
  constructor(user: Partial<User>) {
    if (user.id && 'string' !== typeof user.id) {
      throw new InvalidParamError(User.name, 'id');
    }
    this.id = user.id;
    if ('string' !== typeof user.email) {
      throw new InvalidParamError(User.name, 'email');
    }
    this.email = user.email;
  }
}
