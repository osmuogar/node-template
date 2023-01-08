/* PROJECT_LICENSE */

const ENVIRONMENT = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
};

/**
 * @description Checks if the environment is a valid environment.
 * @param {string} env Environment to check.
 * @returns {boolean}
 */
function isValidEnvironment(env) {
    let result;
    switch (env) {
        case ENVIRONMENT.PRODUCTION:
        case ENVIRONMENT.DEVELOPMENT:
        case ENVIRONMENT.TEST:
            result = true;
            break;
        default:
            result = false;
    }
    return result;
}

module.exports = {
    ENVIRONMENT,
    isValidEnvironment,
};
