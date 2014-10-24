'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var minimatch = require('minimatch');

/**
 * Expose `lookup`
 */

module.exports = function lookup(patterns, cwd, opts) {
  patterns = Array.isArray(patterns) ? patterns : [patterns];
  cwd = path.resolve(cwd, '.');

  var files = fs.readdirSync(cwd);
  var len = files.length;
  var i = 0;

  while (i < len) {
    var fp = path.join(cwd, files[i++]);

    for (var j = 0; j < patterns.length; j++) {
      if (minimatch(fp, patterns[j], opts)) {
        return path.resolve(cwd, fp);
      }
    }
  }

  while (cwd !== process.cwd()) {
    cwd = path.resolve(cwd, '..');
    return lookup(patterns, cwd, opts);
  }
  return null;
};
