'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var isGlob = require('is-glob');
var expandTilde = require('expand-tilde');
var mm = require('micromatch');

/**
 * Expose `lookup`
 */

module.exports = lookup;

/**
 * @param  {String|Array} `patterns` Glob pattern(s) or file path(s) to match against.
 * @param  {Object} `options` Options to pass to [micromatch]. Note that if you want to start in a different directory than the current working directory, specify a `cwd` property here.
 * @return {String} Returns the first matching file.
 * @api public
 */

function lookup(patterns, opts, cwd) {
  if (typeof patterns !== 'string' && !Array.isArray(patterns)) {
    throw new TypeError('look-up expects a string or array as the first argument.');
  }

  // ensure the pattern is an array
  patterns = typeof patterns === 'string'
    ? [patterns]
    : patterns;

  cwd = cwd || opts && opts.cwd || process.cwd();
  cwd = expandTilde(cwd);

  // store a reference to the cwd we just checked
  var prev = cwd;

  for (var len = patterns.length - 1; len >= 0; len--) {
    var pattern = patterns[len];

    // if the pattern is a glob pattern, move on
    if (!isGlob(pattern)) {
      var file = path.resolve(cwd, pattern);

      // we can avoid fs.readdir if it resolves to an actual file
      if (fs.existsSync(file)) {
        return file;
      }
    } else {
      try {
        var files = fs.readdirSync(cwd);
        for (var i = files.length - 1; i >= 0; i--) {
          var fp = files[i];

          // try matching against the basename in the cwd
          if (mm.isMatch(fp, pattern, opts)) {
            return path.resolve(cwd, fp);
          }

          // try matching against the absolute path
          fp = path.resolve(cwd, fp);
          if (mm.isMatch(fp, pattern, opts)) {
            return fp;
          }
        }
      } catch (err) {
        if (opts && opts.verbose) { throw err; }
      }
    }
  }

  // nothing was matched in the previous dir, so move up a
  // directory and create a new `cwd` for the search
  cwd = path.resolve(cwd, '..');

  // we're past the actual cwd with no matches.
  if (prev === cwd) { return null; }

  // try again
  return lookup(patterns, opts, cwd);
}
