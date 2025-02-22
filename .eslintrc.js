/* PROJECT LICENSE */

const JS_RULES = require('./.eslint.js.rules');
const TSDOC_RULES = require('./.eslint.tsdoc.rules');
const TS_RULES = require('./.eslint.ts.rules');

module.exports = {
  env: {
    'commonjs': true,
    'es2021': true,
  },
  ignorePatterns: [
    'node_modules/',
    'doc/',
    'dist/',
    'out/',
    '!.*',
  ],
  overrides: [
    /*
     * You should extend TypeScript plugins here, instead of extending them
     * outside the `overrides`
     */
    {
      files: [
        '*.ts',
        '*.tsx',
      ],
      parserOptions: {
        project: [
          './tsconfig.json',
        ],
      },
      rules: {
        ...TS_RULES,
        ...TSDOC_RULES,
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'ecmaVersion': 'latest',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'eslint-plugin-tsdoc',
    'header',
  ],
  root: true,
  rules: {
    ...JS_RULES,
  },
};
