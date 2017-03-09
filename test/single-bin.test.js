'use strict';

const path = require('path');
const coffee = require('coffee');

describe('test/single-bin.test.js', () => {
  const myBin = require.resolve('./fixtures/single-bin/bin/single-bin.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  it('single-bin --help', done => {
    coffee.fork(myBin, [ '--help' ], { cwd })
      // .debug()
      .expect('stdout', /Options:/)
      .expect('stdout', /-h, --help.*Show help.*boolean/)
      .expect('stdout', /--baseDir.*target directory/)
      .expect('code', 0)
      .end(done);
  });

  it('single-bin --baseDir=simple', done => {
    coffee.fork(myBin, [ '--baseDir=simple' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /run default command at simple/)
      .expect('code', 0)
      .end(done);
  });
});
