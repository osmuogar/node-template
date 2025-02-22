/* PROJECT LICENSE */

export class InvalidParamError extends Error {
  constructor(className: string, paramName: string, expected?: string) {
    let msg = 'Invalid ' + className + ' ' + paramName + '.';
    if (expected !== undefined) {
      msg += ' ' + expected;
    }
    super(msg);
    this.name = 'InvalidParamError';
  }
}
