'use strict';

const path = require('path');
const coffee = require('coffee');

describe('common-bin --version, --help', () => {
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
    coffee.fork(bin, [ '-h' ], {
      cwd: appdir,
    })
    // .debug()
    .expect('stdout', /Usage: .*common-bin.* \[command\] \[options\]/)
    .notExpect('stdout', / {2}More commands/)
    .expect('code', 0)
    .end(done);
  });

  it('should show help with command', done => {
    const bin = path.join(__dirname, 'fixtures/my-bin/bin/my-bin.js');
    coffee.fork(bin, [ '-h' ], {
      cwd: appdir,
    })
    // .debug()
    .expect('stdout', /Usage: .*common-bin.* \[command\] \[options\]/)
    .expect('stdout', / {2}More commands/)
    .expect('code', 0)
    .end(done);
  });
});
