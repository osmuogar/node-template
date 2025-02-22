/* PROJECT LICENSE */

import { Router } from 'express';
import { createUser } from '../controllers/users.controllers';

// eslint-disable-next-line new-cap
const router = Router({ mergeParams: true });

router.route('/')
  .post(createUser);

/*
// Handle /users/:userId/authenticated
router.use('/:userId/authenticated', AuthenticatedRoutes);
*/

export { router as UsersRoutes };
