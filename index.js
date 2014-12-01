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

module.exports = function lookup(patterns, options) {
  var opts = extend({cwd: process.cwd()}, options);
  patterns = !Array.isArray(patterns)
    ? [patterns]
    : patterns;

  var cwd = opts.cwd;
  var files = fs.readdirSync(cwd);
  var len = files.length;
  var i = 0;

  while (i < len) {
    var fp = path.join(cwd, files[i++]);
    if (path.dirname(fp) === '.') {
      break;
    }

    var match = mm(fp, patterns, opts);
    if (match.length === 0) {
      continue;
    }
    return path.resolve(fp);
  }

  var dir = normalized(process.cwd());
  cwd = normalized(cwd);

  if (dir === cwd) {
    return path.resolve(dir);
  }

  cwd = path.join(cwd, '..');
  if (cwd === '..') {
    return null;
  }

  return lookup(patterns, extend(opts, {cwd: cwd}));
};

/**
 * Basic extend
 *
 * @api private
 */

function extend(a, b) {
  for (var key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
}

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