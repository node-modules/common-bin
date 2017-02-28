'use strict';

const path = require('path');
const coffee = require('coffee');

describe('test/common-bin.test.js', () => {
  const bin = path.join(__dirname, 'fixtures/common-bin.js');
  const appdir = path.join(__dirname, 'fixtures/test-files');

  it('should show version', done => {
    coffee.fork(bin, [ '--version' ], {
      cwd: appdir,
    })
    // .debug()
    .expect('stdout', /\d+\.\d+\.\d+/)
    .expect('code', 0)
    .end(done);
  });

  it('should show help', done => {
    coffee.fork(bin, [ '--help' ], {
      cwd: appdir,
    })
    // .debug()
    .expect('stdout', /Options:\s*\n/)
    .expect('stdout', /--version\s*Show version number/)
    .expect('code', 0)
    .end(done);
  });
});
