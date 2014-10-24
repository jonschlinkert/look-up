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
var lookup = require('./');

function norm(fp) {
  return normalize(path.relative('.', fp));
}

describe('lookup', function () {
  it('should support glob patterns', function () {
    norm(lookup('**/c/package.json', 'fixtures/a/b/c/d/e/f/g')).should.eql('fixtures/a/b/c/package.json');
    norm(lookup('**/one.txt', 'fixtures/a/b/c/d/e/f/g')).should.eql('fixtures/a/b/c/d/one.txt');
    norm(lookup('**/two.txt', 'fixtures/a/b/c/d/e/f/g')).should.eql('fixtures/a/b/c/two.txt');
  });

  it('should support arrays of glob patterns', function () {
    norm(lookup('**/c/package.json', 'fixtures/a/b/c/d/e/f/g')).should.eql('fixtures/a/b/c/package.json');
    norm(lookup('**/one.txt', 'fixtures/a/b/c/d/e/f/g')).should.eql('fixtures/a/b/c/d/one.txt');
    norm(lookup('**/two.txt', 'fixtures/a/b/c/d/e/f/g')).should.eql('fixtures/a/b/c/two.txt');
  });

  it('should support minimatch `matchBase` option:', function () {
    var opts = { matchBase: true };

    norm(lookup('package.json', 'fixtures/a/b/c/d/e/f/g', opts)).should.eql('fixtures/a/b/c/d/e/f/g/package.json');
    norm(lookup('one.txt', 'fixtures/a/b/c/d/e/f/g', opts)).should.eql('fixtures/a/b/c/d/one.txt');
    norm(lookup('two.txt', 'fixtures/a/b/c/d/e/f/g', opts)).should.eql('fixtures/a/b/c/two.txt');
    norm(lookup('?.md', 'fixtures/a/b/c/d/e/f/g', opts)).should.eql('fixtures/a/b/a.md');
  });

  it('should return `null` when no files are found:', function () {
    var opts = { matchBase: true };

    (lookup('foo.json', 'fixtures/a/b/c/d/e/f/g') === null).should.be.true;
    (lookup('foo.json', 'fixtures/a/b/c/d/e/f/g', opts) === null).should.be.true;
  });
});
