'use strict';

const path = require('path');
const coffee = require('coffee');
const mm = require('mm');
const rimraf = require('rimraf');

describe('custom egg-bin: my-egg-bin', () => {
  const myBin = require.resolve('./fixtures/my-bin/bin/my-bin.js');

  afterEach(mm.restore);

  it('should my-bin test success', done => {
    const cwd = path.join(__dirname, 'fixtures/test-files');
    rimraf.sync(path.join(cwd, 'node_modules'));
    coffee.fork(myBin, [ 'test' ], {
      cwd,
    })
    // .debug()
    .coverage(false)
    .expect('stdout', /run mocha test/)
    .expect('stdout', /node version: v\d+\.\d+\.\d+/)
    .expect('code', 0)
    .end(done);
  });

  it('should show help message', done => {
    coffee.fork(myBin, [ '-h' ], {
      cwd: path.join(__dirname, 'fixtures/test-files'),
    })
    // .debug()
    .expect('stdout', /test - unit test/)
    .expect('code', 0)
    .end(done);
  });

  it('should show version 2.0.0', done => {
    coffee.fork(myBin, [ '--version' ], {
      cwd: path.join(__dirname, 'fixtures/test-files'),
    })
    // .debug()
    .expect('stdout', '2.0.0\n')
    .expect('code', 0)
    .end(done);
  });
});
