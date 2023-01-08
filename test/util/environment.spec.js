/* PROJECT_LICENSE */

const {
    ok,
} = require('assert');

const {
    ENVIRONMENT,
    isValidEnvironment,
} = require('../../src/util/environment');

describe('environment test suite', () => {
    describe('is valid environment test', () => {
        it('production, development and test are valid environments', () => {
            ok(isValidEnvironment(ENVIRONMENT.PRODUCTION));
            ok(isValidEnvironment(ENVIRONMENT.DEVELOPMENT));
            ok(isValidEnvironment(ENVIRONMENT.TEST));
        });

        it('other values are not valid', () => {
            ok(!isValidEnvironment());
            ok(!isValidEnvironment(null));
            ok(!isValidEnvironment('something'));
            ok(!isValidEnvironment(5));
            ok(!isValidEnvironment({}));
        });
    });
});
