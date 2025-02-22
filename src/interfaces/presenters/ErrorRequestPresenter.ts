/* PROJECT LICENSE */

import { RequestPresenter } from './RequestPresenter';

export interface ErrorRequestPresenter extends RequestPresenter {
  success: false;
  message: string;
}
