'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var cache = {};

/**
 * Expose `lookup`
 */

module.exports = lookup;

/**
 * @param  {String|Array} `pattern` Glob pattern or file path(s) to match against.
 * @param  {Object} `options` Options to pass to [micromatch]. Note that if you want to start in a different directory than the current working directory, specify a `cwd` property here.
 * @return {String} Returns the first matching file.
 * @api public
 */

function lookup(filename, opts) {
  if (!utils.isValidGlob(filename)) {
    throw new TypeError('expected a string.');
  }

  var cwd = resolveCwd(opts || {});

  try {
    if (utils.isGlob(filename)) {
      return matchFile(cwd, filename, opts);
    } else {
      return findFile(cwd, filename);
    }
  } catch(err) {
    console.log(err);
  }
  return null;
}

function matchFile(cwd, pattern, opts) {
  var isMatch = utils.mm.matcher(pattern, opts);
  var files = fs.readdirSync(cwd);
  var len = files.length, i = -1;

  while (++i < len) {
    var name = files[i];
    var fp = path.join(cwd, name);
    if (isMatch(name) || isMatch(fp)) {
      return fp;
    }
  }
  cwd = path.dirname(cwd);
  return matchFile(cwd, pattern, opts);
}

function findFile(cwd, filename) {
  var fp = path.join(cwd, filename);
  if (fs.existsSync(fp)) {
    return path.resolve(fp);
  }
  var last = cwd;
  cwd = path.dirname(cwd);
  if (cwd === last) return null;
  return findFile(cwd, filename);
}

function resolveCwd(opts) {
  var cwd = opts.cwd || '';
  if (/^\W/.test(cwd)) {
    cwd = utils.resolve(cwd);
  }
  return cwd;
}
