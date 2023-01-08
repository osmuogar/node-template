/* PROJECT_LICENSE */

class InvalidParamError extends Error() {
    /**
     * @param {string} msg Error message.
     */
    constructor(msg) {
        super('INVALID_PARAM. ' + msg);
    }
}

module.exports = {
    InvalidParamError,
};
