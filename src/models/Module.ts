/* PROJECT LICENSE */

/**
 * A collection of lessons related to a specific topic.
 */
export class Module {
  id: string | undefined;
  title: string;
  isRootModule: boolean;
  moduleId: string | undefined;
  courseId: string;

  constructor(module: Partial<Module>) {
    if (module.id && 'string' !== typeof module.id) {
      throw new Error('Invalid id type');
    }
    this.id = module.id;
    if ('string' !== typeof module.title || module.title.length < 1 || module.title.length > 255) {
      throw new Error('Invalid title type');
    }
    this.title = module.title;
    if (module.moduleId) {
      if ('string' !== typeof module.moduleId) {
        throw new Error('Invalid moduleId type');
      }
      this.moduleId = module.moduleId;
      this.isRootModule = false;
    } else {
      this.isRootModule = true;
    }
    if ('string' !== typeof module.courseId) {
      throw new Error('Invalid courseId type');
    }
    this.courseId = module.courseId;
  }
}
