'use strict';

/**
 * get-value
 */

var Suite = require('benchmarked');

var suite = new Suite({
  result: true,
  fixtures: 'fixtures/*.js',
  add: 'code/*.js',
  cwd: 'benchmark'
});

suite.run();