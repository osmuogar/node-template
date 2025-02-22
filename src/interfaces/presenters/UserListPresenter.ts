/* PROJECT LICENSE */

import { RequestPresenter } from './RequestPresenter';
import { User } from '../../models/User';

export interface UserListPresenter extends RequestPresenter {
  items: Required<User>[];
}
