/* PROJECT_LICENSE */

const JS_RULES = require('./.eslint.js.rules');
const JSDOC_RULES = require('./.eslint.jsdoc.rules');

module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
    },
    'ignorePatterns': [
        'node_modules/',
        'doc/',
        'dist/',
        '!.*',
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
    },
    'plugins': [
        'jsdoc',
        'header',
    ],
    'root': true,
    'rules': {
        ...JS_RULES,
        ...JSDOC_RULES,
    },
};
