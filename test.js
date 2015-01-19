/*!
 * look-up <https://github.com/jonschlinkert/look-up>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var path = require('path');
var assert = require('assert');
var should = require('should');
var norm = require('normalize-path');
var resolve = require('resolve');
// var lookup = require('findup-sync');
var lookup = require('./');

function normalize(fp) {
  return fp ? norm(path.relative('.', fp)) : null;
}
function npm(name) {
  return path.dirname(resolve.sync(name));
}

describe('lookup', function () {
  it('should throw when the first arg is not a string or array:', function () {
    (function() {
      lookup();
    }).should.throw('look-up expects a string or array as the first argument.')
  });

  it('should work when no cwd is given', function () {
    normalize(lookup('package.json')).should.equal('package.json');
  });

  it('should support normal (non-glob) file paths:', function () {
    var normPath = normalize(lookup('package.json', {cwd: path.dirname(resolve.sync('normalize-path'))}))
    normPath.should.equal('node_modules/normalize-path/package.json');

    var isGlob = normalize(lookup('package.json', {cwd: path.dirname(resolve.sync('is-glob'))}))
    isGlob.should.equal('node_modules/is-glob/package.json');
  });

  it('should support glob patterns', function () {
    normalize(lookup('**/c/package.json', {cwd: 'fixtures/a/b/c/d/e/f/g'})).should.equal('fixtures/a/b/c/package.json');
    normalize(lookup('**/one.txt', {cwd: 'fixtures/a/b/c/d/e/f/g'})).should.equal('fixtures/a/b/c/d/one.txt');
    normalize(lookup('**/two.txt', {cwd: 'fixtures/a/b/c/d/e/f/g'})).should.equal('fixtures/a/b/c/two.txt');

    var bs1 = normalize(lookup('b*.json', {cwd: npm('bootstrap')}));
    bs1.should.equal('node_modules/bootstrap/bower.json');

    var bs2 = normalize(lookup('p*.json', {cwd: npm('bootstrap')}));
    bs2.should.equal('node_modules/bootstrap/package.json');
  });

  it('should support arrays of glob patterns', function () {
    normalize(lookup(['**/c/package.json'], {cwd: 'fixtures/a/b/c/d/e/f/g'})).should.equal('fixtures/a/b/c/package.json');
    normalize(lookup(['**/one.txt'], {cwd: 'fixtures/a/b/c/d/e/f/g'})).should.equal('fixtures/a/b/c/d/one.txt');
    normalize(lookup(['**/two.txt'], {cwd: 'fixtures/a/b/c/d/e/f/g'})).should.equal('fixtures/a/b/c/two.txt');
  });

  it('should support minimatch `matchBase` option:', function () {
    var opts = { matchBase: true, cwd: 'fixtures/a/b/c/d/e/f/g' };
    normalize(lookup('package.json', opts)).should.equal('fixtures/a/b/c/d/e/f/g/package.json');
    normalize(lookup('one.txt', opts)).should.equal('fixtures/a/b/c/d/one.txt');
    normalize(lookup('two.txt', opts)).should.equal('fixtures/a/b/c/two.txt');
  });

  it('should return `null` when no files are found:', function () {
    var bootstrap = normalize(lookup('*.foo', {cwd: path.dirname(resolve.sync('bootstrap'))}));
    (bootstrap == null).should.be.true;

    assert.equal(lookup('**/b*.json', {cwd: npm('is-glob')}), null);
    assert.equal(lookup('foo.json', {cwd: 'fixtures/a/b/c/d/e/f/g'}), null);
    assert.equal(lookup('foo.json', {cwd: 'fixtures/a/b/c/d/e/f/g', matchBase: true}), null);
  });
});
