/* PROJECT LICENSE */

const ESLINT_ERROR_LEVEL = require('./.eslint.lvl.rules');

const ALL_RULES = {
  'tsdoc/syntax': ESLINT_ERROR_LEVEL.DEFAULT,
};

module.exports = {
  ...ALL_RULES,
};
