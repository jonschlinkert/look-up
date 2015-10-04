'use strict';

var fs = require('fs');
var bold = require('ansi-bold');
var path = require('path');

/**
 * Sanity check
 *
 * Run to ensure that all fns return the same result.
 */

fs.readdirSync(__dirname + '/code').forEach(function (fp) {
  var fn = require(path.resolve(__dirname, 'code', fp));
  var name = path.basename(fp, path.extname(fp));

  var cwd = __dirname + '/fixtures/non-glob';
  fs.readdirSync(cwd).forEach(function (fixture) {
    fixture = path.resolve(cwd, fixture);
    console.log(bold(name) + ':', fn.apply(null, require(fixture)));
  });
});
