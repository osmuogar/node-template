/* PROJECT LICENSE */

import { createCourse, getCourseById, getCourses } from '../controllers/courses.controllers';
import { ModulesRoutes } from './modules.routes';
import { Router } from 'express';

// eslint-disable-next-line new-cap
const router = Router({ mergeParams: true });

router.route('/')
  .get(getCourses)
  .post(createCourse);

// Handle course operations
router.route('/:courseId')
  .get(getCourseById);

// Handle /users/:userId/courses/:courseId/modules
router.use('/:courseId/modules', ModulesRoutes);

export { router as CoursesRoutes };
