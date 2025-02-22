/* PROJECT LICENSE */

/**
 * Keeps track of the lessons that a user has completed.
 */
export class Completion {
  id?: string;
  userId: string;
  moduleId?: string;
  lessonId: string;

  // TODO: Check existence and type of each parameter.
  constructor(completion: Partial<Completion>) {
    if (completion.id && 'string' !== typeof completion.id) {
      throw new Error('Invalid completion id');
    }
    this.id = completion.id;
    if (!completion.userId || 'string' !== typeof completion.userId) {
      throw new Error('Invalid user id');
    }
    this.userId = completion.userId;
    if (completion.moduleId && 'string' !== typeof completion.moduleId) {
      throw new Error('Invalid module id');
    }
    this.moduleId = completion.moduleId;
    if (!completion.lessonId || 'string' !== typeof completion.lessonId) {
      throw new Error('Invalid lesson id');
    }
    this.lessonId = completion.lessonId;
  }
}
