/* PROJECT LICENSE */

import { createLesson, getLessonById, getLessons } from '../controllers/lessons.controllers';
import { CompletionRoutes } from './completions.routes';
import { Router } from 'express';

// eslint-disable-next-line new-cap
const router = Router({ mergeParams: true });

router.route('/')
  .get(getLessons)
  .post(createLesson);

router.route('/:lessonId')
  .get(getLessonById);

// Handle /users/:userId/courses/:courseId/completion
router.use('/:lessonId/completions', CompletionRoutes);

export { router as LessonsRoutes };
