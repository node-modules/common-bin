'use strict';

const path = require('path');
const coffee = require('coffee');

describe('test/async-bin.test.js', () => {
  const myBin = require.resolve('./fixtures/async-bin/bin/async-bin.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  it('async-bin --help', done => {
    coffee.fork(myBin, [ '--help' ], { cwd })
      // .debug()
      .expect('stdout', /sleep\s*sleep showcase/)
      .expect('code', 0)
      .end(done);
  });

  it('async-bin', done => {
    coffee.fork(myBin, [ '--name', 'tz' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /run async command with tz/)
      .expect('stdout', /hi/)
      .expect('stdout', /undefined, async, promise/)
      .expect('code', 0)
      .end(done);
  });

  it('async-bin sleep', done => {
    coffee.fork(myBin, [ 'sleep' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /sleep 1s/)
      .expect('code', 0)
      .end(done);
  });

  it('async-bin generator', done => {
    coffee.fork(myBin, [ 'generator' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stderr', /TypeError: helper.callFn don't support generator function/)
      .expect('code', 1)
      .end(done);
  });
});
