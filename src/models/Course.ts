/* PROJECT LICENSE */

/**
 * Collection of modules and lessons related to a specific topic.
 */
export class Course {
  id?: string;
  title: string;

  constructor(course: Partial<Course>) {
    if (course.id && 'string' !== typeof course.id) {
      throw new Error('Invalid course id');
    }
    this.id = course.id;
    if (!course.title || 'string' !== typeof course.title) {
      throw new Error('Invalid course title');
    }
    this.title = course.title;
  }
}
