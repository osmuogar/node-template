/* PROJECT_LICENSE */

const {
    isValidEnvironment,
    InvalidParamError,
} = require('./util');

/**
 * @description Main function of the package.
 * @param {string[]} args Obtained from process arguments.
 * @throws {InvalidParamError} When NODE_ENV contains an invalid value.
 * @returns {void}
 */
function main(args) {
    /* Check for a correct node environment. */
    if (process.env.NODE_ENV) {
        if (!isValidEnvironment(process.env.NODE_ENV)) {
            throw new InvalidParamError('Invalid NODE_ENV value');
        }
    }

    args.shift(); // Remove first argument
    args.shift(); // Remove second argument

    process.stdout.write('Input arguments: ' + JSON.stringify(args) + '\n');
}

// Main execution
try {
    main(process.argv);
} catch (err) {
    if (err instanceof Error) {
        process.stderr.write('Process finished with error: ' + err.message +
            ': ' + err.stack);
    }
    throw err;
} finally {
    /* Close streams or connections */
}
