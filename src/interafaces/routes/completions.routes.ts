/* PROJECT LICENSE */

import { Router } from 'express';
import { createCompletion } from '../controllers/completions.controllers';

// eslint-disable-next-line new-cap
const router = Router({ mergeParams: true });

router.route('/')
  .post(createCompletion);

export { router as CompletionRoutes };
