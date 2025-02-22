/* PROJECT LICENSE */

import { CoursesRoutes } from './courses.routes';
import { Router } from 'express';
import { createUser } from '../controllers/users.controllers';

// eslint-disable-next-line new-cap
const router = Router({ mergeParams: true });

router.route('/')
  .post(createUser);

// Handle /users/:userId/courses
router.use('/:userId/courses', CoursesRoutes);

export { router as UsersRoutes };
