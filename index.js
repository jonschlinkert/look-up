'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var normalize = require('normalize-path');
var isGlob = require('is-glob');
var mm = require('multimatch');
var dir = sanitize(process.cwd());

/**
 * Expose `lookup`
 */

module.exports = function lookup(patterns, options) {
  if (typeof patterns !== 'string' && !Array.isArray(patterns)) {
    throw new TypeError('look-up expects a string or array as the first argument.');
  }

  patterns = typeof patterns === 'string'
    ? [patterns]
    : patterns;

  options = options || {matchBase: true};
  var cwd = options.cwd || process.cwd();
  var plen = patterns.length;

  while (plen--) {
    var pattern = patterns[plen];
    if (isGlob(pattern)) {
      continue;
    }

    var tmp = path.join(cwd, pattern);
    if (fs.existsSync(tmp)) {
      return tmp;
    }
  }

  var files = fs.readdirSync(cwd);
  var len = files.length;

  while (len--) {
    var fp = path.join(cwd, files[len]);
    if (path.dirname(fp) === '.') break;

    var match = mm(fp, patterns, options);
    if (match.length === 0) {
      continue;
    }
    return fp;
  }

  if (dir === sanitize(cwd)) {
    return cwd;
  }

  cwd = path.join(cwd, '..');
  if (cwd === '..') {
    return null;
  }

  options.cwd = cwd;
  return lookup(patterns, options);
};

/**
 * Sanitize the paths for clean comparisons
 *
 * @api private
 */

function sanitize(fp) {
  // strip drive letter
  if (/^\w:/.test(fp)) fp = fp.slice(2);

  // strip leading slashes
  fp = fp.replace(/^[\\\/]+/, '');
  fp = normalize(fp).toLowerCase();
  return fp;
}