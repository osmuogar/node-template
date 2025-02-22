/* PROJECT LICENSE */

import { createUser, deleteUser, listUsers, readUser, updateUser } from '../controllers/users.controllers';
import { Router } from 'express';

// eslint-disable-next-line new-cap
const router = Router({ mergeParams: true });

router.route('/')
  .get(listUsers)
  .post(createUser);

router.route('/:userId')
  .get(readUser)
  .post(updateUser)
  .delete(deleteUser);

/*
// Handle /users/:userId/authenticated
router.use('/:userId/authenticated', AuthenticatedRoutes);
*/

export { router as UsersRoutes };
