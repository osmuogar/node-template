/* PROJECT LICENSE */

export class InvalidReqParamError extends Error {
  constructor(functionName: string, paramName: string, expected?: string) {
    let msg = 'Invalid ' + paramName + ' while ' + functionName + '.';
    if (expected !== undefined) {
      msg += ' ' + expected + '.';
    }
    super(msg);
    this.name = 'InvalidReqParamError';
  }
}
