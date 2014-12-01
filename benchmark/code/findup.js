'use strict';

/**
 * [findup-sync](https://github.com/cowboy/node-findup-sync)
 */

var findup = require('findup-sync');

module.exports = function (patterns, options) {
  return findup(patterns, options);
};