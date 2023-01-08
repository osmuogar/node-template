/* PROJECT_LICENSE */

const {
    ENVIRONMENT, isValidEnvironment,
} = require('./environment');

const {
    InvalidParamError,
} = require('./error');

module.exports = {
    ENVIRONMENT, InvalidParamError, isValidEnvironment,
};
