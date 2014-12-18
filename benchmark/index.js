'use strict';

var Suite = require('benchmarked');

var suite = new Suite({
  result: false,
  fixtures: 'fixtures/*.js',
  add: 'code/*.js',
  cwd: __dirname
});

suite.run();