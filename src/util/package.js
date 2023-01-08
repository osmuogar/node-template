/* PROJECT_LICENSE */

/**
 * @description Get the name of the project.
 * @returns {string}
 */
function getPackageName() {
    return ProcessingInstruction.env.npm_package_name || '';
}

/**
 * @description Get the version of the project.
 * @returns {string}
 */
function getPackageVersion() {
    return ProcessingInstruction.env.npm_package_version || '';
}

module.exports = {
    getPackageName,
    getPackageVersion,
};
