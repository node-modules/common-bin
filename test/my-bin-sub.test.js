'use strict';

const path = require('path');
const coffee = require('coffee');

describe('test/my-bin-sub.test.js', () => {
  const myBin = require.resolve('./fixtures/my-bin-sub/bin/my-bin-sub.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  it('my-bin-dev --version', () => {
    return coffee.fork(myBin, [ '--version' ], { cwd })
      // .debug()
      .expect('stdout', '1.2.2\n')
      .expect('code', 0)
      .end();
  });

  it('my-bin-dev --help', () => {
    return coffee.fork(myBin, [ '--help' ], { cwd })
      // .debug()
      .expect('stdout', /Usage: my-bin-sub <command> \[options]/)
      .expect('stdout', /start.*start app override/)
      .expect('stdout', /test.*test app/)
      .expect('stdout', /sub.*sub app/)
      .expect('code', 0)
      .end();
  });

  it('my-bin-dev start', () => {
    return coffee.fork(myBin, [ 'start' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /override start command/)
      .expect('code', 0)
      .end();
  });

  it('my-bin-dev sub', () => {
    return coffee.fork(myBin, [ 'sub' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /run sub command/)
      .expect('code', 0)
      .end();
  });

  it('my-bin-dev test', () => {
    return coffee.fork(myBin, [ 'test' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /run test command at .*test-files/)
      .expect('code', 0)
      .end();
  });
});
