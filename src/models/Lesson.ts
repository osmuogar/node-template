/* PROJECT LICENSE */

/**
 * A brief explanation or exercise related to a specific topic.
 */
export class Lesson {
  id?: string;
  moduleId: string;
  title: string;

  constructor(lesson: Partial<Lesson>) {
    if (lesson.id && 'string' !== typeof lesson.id) {
      throw new Error('Invalid lesson id');
    }
    this.id = lesson.id;
    if (!lesson.moduleId || 'string' !== typeof lesson.moduleId) {
      throw new Error('Invalid lesson moduleId');
    }
    this.moduleId = lesson.moduleId;
    if (!lesson.title || 'string' !== typeof lesson.title) {
      throw new Error('Invalid lesson title');
    }
    this.title = lesson.title;
  }
}
