'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var isGlob = require('is-glob');
var mm = require('micromatch');
var dir = process.cwd();

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

  var opts = options || {};
  var cwd = opts.cwd || process.cwd();
  var len = patterns.length;

  // loop over patterns
  while (len--) {
    var pattern = patterns[len];

    // if the pattern is a glob pattern, move on
    if (!isGlob(pattern)) {

      // if the pattern is not a glob pattern, try
      // to see if it resolves to an actual file so
      // we can avoid using fs.readdir and matching
      var file = path.join(cwd, pattern);
      if (fs.existsSync(file)) {
        return file;
      }
    } else if (!/\*\*/.test(pattern)) {
      opts.matchBase = true;
    }
  }

  var files = fs.readdirSync(cwd);
  var flen = files.length;

  // loop through the files in the current directory
  while (flen--) {
    var fp = path.join(cwd, files[flen]);

    // if the current directory is the actual cwd, break out
    if (path.dirname(fp) === '.') break;

    // if the file path matches the pattern(s), return it
    var match = mm(fp, patterns, opts);
    if (match.length !== 0) {
      return fp;
    }
  }

  // nothing was matched in the last dir, so move up a
  // directory and create a new `cwd` for the search
  cwd = path.resolve(cwd, '..');

  // we're past the actual cwd with no matches.
  if (cwd === dir) return null;

  // try again
  opts.cwd = cwd;
  return lookup(patterns, opts);
};
