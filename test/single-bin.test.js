'use strict';

const path = require('path');
const coffee = require('coffee');
const mm = require('mm');

describe('test/single-bin.test.js', () => {
  afterEach(mm.restore);

  const myBin = require.resolve('./fixtures/single-bin/bin/single-bin.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  it('single-bin --help', () => {
    return coffee.fork(myBin, [ '--help' ], { cwd })
      // .debug()
      .expect('stdout', /Options:/)
      .expect('stdout', /-h, --help.*/)
      .expect('stdout', /--baseDir.*target directory/)
      .expect('code', 0)
      .end();
  });

  it('single-bin --baseDir=simple', () => {
    mm(process.env, 'TEST_MOCK_ENV', 'hello-bin');
    return coffee.fork(myBin, [ '--baseDir=simple' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /run default command at simple/)
      .expect('stdout', /"TEST_MOCK_ENV": "hello-bin"/)
      .expect('code', 0)
      .end();
  });
});
