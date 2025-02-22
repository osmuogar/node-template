/* PROJECT LICENSE */

import { createModule, getModuleById, getModules } from '../controllers/modules.controllers';
import { LessonsRoutes } from './lessons.routes';
import { Router } from 'express';

// eslint-disable-next-line new-cap
const router = Router({ mergeParams: true });

router.route('/')
  .get(getModules)
  .post(createModule);

// Handle module operations
router.route('/:moduleId')
  .get(getModuleById);

// Handle /modules/:moduleId/modules
router.use('/:moduleId/modules', router);

// Handle /modules/:moduleId/lessons
router.use('/:moduleId/lessons', LessonsRoutes);

export { router as ModulesRoutes };
