'use strict';

const path = require('path');
const coffee = require('coffee');

describe('test/single-bin.test.js', () => {
  const myBin = require.resolve('./fixtures/single-bin/bin/single-bin.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  it('should `single-bin --baseDir=simple` success', done => {
    coffee.fork(myBin, [ '--baseDir=simple' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /run command with simple/)
      .expect('code', 0)
      .end(done);
  });
});
