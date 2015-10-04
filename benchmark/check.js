'use strict';

var fs = require('fs');
var glob = require('glob');
var bold = require('ansi-bold');
var path = require('path');

var code = glob.sync(__dirname + '/code/*.js');
var fixtures = glob.sync(__dirname + '/fixtures/**/*.js');

/**
 * Sanity check
 *
 * Run to ensure that all fns return the same result.
 */

code.forEach(function (fp) {
  var fn = require(path.resolve(__dirname, 'code', fp));
  var name = path.basename(fp, path.extname(fp));

  fixtures.forEach(function (fixture) {
    console.log(bold(name) + ':', fn.apply(null, require(fixture)));
  });
});
