/*!
 * look-up <https://github.com/jonschlinkert/look-up>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var path = require('path');
var should = require('should');
var normalize = require('normalize-path');
var resolve = require('resolve');
var lookup = require('./');

function norm(fp) {
  return normalize(path.relative('.', fp));
}

describe('lookup', function () {
  it('should throw when the first arg is not a string or array:', function () {
    (function() {
      lookup();
    }).should.throw('look-up expects a string or array as the first argument.')
  });

  it('should work when no cwd is given', function () {
    norm(lookup('package.json')).should.equal('package.json');
  });

  it('should support normal (non-glob) file paths:', function () {
    var isGlob = norm(lookup('package.json', {cwd: path.dirname(resolve.sync('normalize-path'))}))
    isGlob.should.equal('node_modules/normalize-path/package.json');
    var isGlob = norm(lookup('package.json', {cwd: path.dirname(resolve.sync('is-glob'))}))
    isGlob.should.equal('node_modules/is-glob/package.json');
  });

  it('should support glob patterns', function () {
    norm(lookup('**/c/package.json', {cwd: 'fixtures/a/b/c/d/e/f/g'})).should.equal('fixtures/a/b/c/package.json');
    norm(lookup('**/one.txt', {cwd: 'fixtures/a/b/c/d/e/f/g'})).should.equal('fixtures/a/b/c/d/one.txt');
    norm(lookup('**/two.txt', {cwd: 'fixtures/a/b/c/d/e/f/g'})).should.equal('fixtures/a/b/c/two.txt');
  });

  it('should support arrays of glob patterns', function () {
    norm(lookup(['**/c/package.json'], {cwd: 'fixtures/a/b/c/d/e/f/g'})).should.equal('fixtures/a/b/c/package.json');
    norm(lookup(['**/one.txt'], {cwd: 'fixtures/a/b/c/d/e/f/g'})).should.equal('fixtures/a/b/c/d/one.txt');
    norm(lookup(['**/two.txt'], {cwd: 'fixtures/a/b/c/d/e/f/g'})).should.equal('fixtures/a/b/c/two.txt');
  });

  it('should support minimatch `matchBase` option:', function () {
    var opts = { matchBase: true, cwd: 'fixtures/a/b/c/d/e/f/g' };
    norm(lookup('package.json', opts)).should.equal('fixtures/a/b/c/d/e/f/g/package.json');
    norm(lookup('one.txt', opts)).should.equal('fixtures/a/b/c/d/one.txt');
    norm(lookup('two.txt', opts)).should.equal('fixtures/a/b/c/two.txt');
    norm(lookup('?.md', opts)).should.equal('fixtures/a/b/a.md');
  });

  it('should return `null` when no files are found:', function () {
    (lookup('foo.json', {cwd: 'fixtures/a/b/c/d/e/f/g'}) === null).should.be.true;
    (lookup('foo.json', {cwd: 'fixtures/a/b/c/d/e/f/g', matchBase: true}) === null).should.be.true;
  });
});
