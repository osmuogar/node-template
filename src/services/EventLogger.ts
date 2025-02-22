/* PROJECT LICENSE */

/**
 * Basic event logger.
 */
export class EventLogger {
  // Avoid instantiating this class
  private constructor() { }

  /**
   * Logs without finishing the line.
   * @param msg - Message to log.
   */
  static log(msg: string): void {
    process.stdout.write(msg);
  }
  /**
   * Logs an info line.
   * @param msg - Message to log.
   */
  static info(msg: string): void {
    EventLogger.log('Info: ' + msg + '\n');
  }
  /**
   * Logs an error line.
   * @param msg - Message to log.
   */
  static err(msg: string): void {
    EventLogger.log('Error: ' + msg + '\n');
  }
}
