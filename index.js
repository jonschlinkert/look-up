'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var normalize = require('normalize-path');
var mm = require('multimatch');

/**
 * Expose `lookup`
 */

module.exports = function lookup(pattern, options) {
  if (typeof pattern !== 'string' && !Array.isArray(pattern)) {
    throw new TypeError('look-up expects a string as the first argument.');
  }

  pattern = typeof pattern === 'string' ? [pattern] : pattern;
  options = options || {matchBase: true};

  var cwd = options.cwd || process.cwd();
  var files = fs.readdirSync(cwd);
  var len = files.length;
  var i = 0;

  while (i < len) {
    var fp = path.join(cwd, files[i++]);
    if (path.dirname(fp) === '.') {
      break;
    }

    var match = mm(fp, pattern, options);
    if (match.length === 0) {
      continue;
    }
    return fp;
  }


  var dir = normalized(process.cwd());
  if (dir === normalized(cwd)) {
    return cwd;
  }

  cwd = path.join(cwd, '..');
  if (cwd === '..') {
    return null;
  }

  options.cwd = cwd;
  return lookup(pattern, options);
};

/**
 * Normalize the paths for comparisons
 *
 * @api private
 */

function normalized(fp) {
  if (/^\w:/.test(fp)) {
    fp = fp.slice(2);
  }

  // strip leading slashes
  fp = fp.replace(/^[\\\/]+/, '');
  return normalize(fp)
    .toLowerCase();
}