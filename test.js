/*!
 * look-up <https://github.com/jonschlinkert/look-up>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var should = require('should');
var norm = require('normalize-path');
var resolve = require('resolve');
var home = require('user-home');
// var lookup = require('findup-sync');
var lookup = require('./');

function normalize(fp) {
  return fp ? norm(path.relative('.', fp)) : null;
}

function npm(name) {
  return path.dirname(resolve.sync(name));
}

describe('lookup', function () {
  before(function () {
    fs.writeFileSync(home + '/_aaa.txt', '');
    fs.writeFileSync(home + '/_bbb.txt', '');
  });
  after(function () {
    fs.unlinkSync(home + '/_aaa.txt');
    fs.unlinkSync(home + '/_bbb.txt');
  });

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

  it('should find files with absolute paths:', function () {
    var opts = { cwd: '/Users/jonschlinkert/dev/utils/data-store' };
    normalize(lookup('package.json', opts)).should.equal('../../utils/data-store/package.json');
    assert.equal(lookup('one.txt', opts), null);
    assert.equal(lookup('two.txt', opts), null);
  });

  it('should find files the cwd is a file name:', function () {
    normalize(lookup('package.json', { cwd: './package.json' })).should.equal('package.json');
    normalize(lookup('package.json', { cwd: 'p*e.json' })).should.equal('package.json');
  });

  it('should find files with absolute paths:', function () {
    lookup('_*b.txt', { cwd: home }).should.equal(home + '/' + '_bbb.txt');
  });

  it('should find files with absolute paths when the cwd is a file name:', function () {
    lookup('_*b.txt', { cwd: path.join(home, '_bbb.txt') }).should.equal(home + '/' + '_bbb.txt');
  });

  it('should recurse until it finds a file matching the given pattern:', function () {
    var opts = { cwd: 'fixtures/a/b/c/d/e/f/g' };
    lookup('_a*.txt', opts).should.equal(path.join(home, '_aaa.txt'));
  });

  it('should find files using tilde expansion:', function () {
    var opts = { cwd: '~/dev/utils/data-store/package.json' };
    normalize(lookup('*.json', opts)).should.equal('../../utils/data-store/package.json');
    assert.equal(lookup('one.txt', opts), null);
    assert.equal(lookup('two.txt', opts), null);
  });

  it('should return `null` when no files are found:', function () {
    var bootstrap = normalize(lookup('*.foo', {cwd: path.dirname(resolve.sync('bootstrap'))}));
    (bootstrap == null).should.be.true;

    assert.equal(lookup('**/b*.json', {cwd: npm('is-glob')}), '/Users/jonschlinkert/.yo-rc-global.json');
    assert.equal(lookup('**/b*.json', {cwd: 'node_modules/is-glob'}), '/Users/jonschlinkert/.yo-rc-global.json');
    assert.equal(lookup('foo.json', {cwd: 'fixtures/a/b/c/d/e/f/g'}), null);
    assert.equal(lookup('foo.json', {cwd: 'fixtures/a/b/c/d/e/f/g', matchBase: true}), null);
  });
});
