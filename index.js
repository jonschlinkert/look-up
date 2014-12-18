'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var isGlob = require('is-glob');
var mm = require('multimatch');

/**
 * Expose `lookup`
 */

module.exports = function lookup(patterns, options) {
  if (typeof patterns !== 'string' && !Array.isArray(patterns)) {
    throw new TypeError('look-up expects a string or array as the first argument.');
  }

  // ensure the pattern is an array
  patterns = typeof patterns === 'string'
    ? [patterns]
    : patterns;

  options = options || {matchBase: true};
  var cwd = options.cwd || process.cwd();
  var plen = patterns.length;

  // loop over patterns
  while (plen--) {
    var pattern = patterns[plen];
    // if the pattern is a glob pattern, move on
    if (isGlob(pattern)) {
      continue;
    }
    // if the pattern is not a glob pattern, try
    // to see if it resolves to an actual file so
    // we can avoid using minimatch
    var tmp = path.join(cwd, pattern);
    if (fs.existsSync(tmp)) {
      return tmp;
    }
  }

  var files = fs.readdirSync(cwd);
  var len = files.length;

  // loop through the files in the current directory
  while (len--) {
    var fp = path.join(cwd, files[len]);

    // if the current directory is the actual cwd, break out
    if (path.dirname(fp) === '.') break;

    // check the file path to see if it matches the pattern(s)
    var match = mm(fp, patterns, options);
    if (match.length === 0) {
      continue;
    }
    return fp;
  }

  // since nothing was matched in the last dir,
  // move up a directory and create a new `cwd` for the search
  cwd = path.join(cwd, '..');
  if (cwd !== '..') {
    // since we haven't run out of dirs yet, try again
    options.cwd = cwd;
    return lookup(patterns, options);
  }

  // if we're here, it means we're past the actual cwd
  // so we've gone too far, no matches...
  return null;
};
