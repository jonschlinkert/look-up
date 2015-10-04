'use strict';

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign `require` to trick browserify into
 * including lazy-cached deps
 */

var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('is-glob');
require('normalize-path', 'normalize');
require('resolve-dir', 'resolve');
require('micromatch', 'mm');

/**
 * Expose `utils`
 */

module.exports = utils;
