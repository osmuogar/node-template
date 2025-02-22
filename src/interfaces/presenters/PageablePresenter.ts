/* PROJECT LICENSE */

import { RequestPresenter } from './RequestPresenter';
import { User } from '../../models/User';

export interface PageablePresenter extends RequestPresenter {
  items: Required<User>[];
  perPage: number;
  page: number;
  total: number;
}
