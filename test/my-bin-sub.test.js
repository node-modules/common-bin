'use strict';

const path = require('path');
const coffee = require('coffee');

describe('test/my-bin-sub.test.js', () => {
  const myBin = require.resolve('./fixtures/my-bin-sub/bin/my-bin-sub.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  it('my-bin-dev --version', done => {
    coffee.fork(myBin, [ '--version' ], { cwd })
      // .debug()
      .expect('stdout', '3.0.0\n')
      .expect('code', 0)
      .end(done);
  });

  it('my-bin-dev --help', done => {
    coffee.fork(myBin, [ '--help' ], { cwd })
      // .debug()
      .expect('stdout', /Usage: my-bin-sub <command> \[options]/)
      .expect('stdout', /Commands:/)
      .expect('stdout', /start.*start app override/)
      .expect('stdout', /test.*test app/)
      .expect('stdout', /sub.*sub app/)
      .expect('code', 0)
      .end(done);
  });

  it('my-bin-dev start', done => {
    coffee.fork(myBin, [ 'start' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /override start command/)
      .expect('code', 0)
      .end(done);
  });

  it('my-bin-dev sub', done => {
    coffee.fork(myBin, [ 'sub' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /run sub command/)
      .expect('code', 0)
      .end(done);
  });

  it('my-bin-dev test', done => {
    coffee.fork(myBin, [ 'test' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /run test command at .*test-files/)
      .expect('code', 0)
      .end(done);
  });
});
