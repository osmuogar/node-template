/* PROJECT LICENSE */

import { RequestPresenter } from './RequestPresenter';
import { User } from '../../models/User';

export interface UserPresenter extends RequestPresenter {
  data: Required<User>
}
