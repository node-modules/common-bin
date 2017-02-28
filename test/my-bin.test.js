'use strict';

const path = require('path');
const coffee = require('coffee');

describe('test/my-bin.test.js', () => {
  const myBin = require.resolve('./fixtures/my-bin/bin/my-bin.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  describe('global options', () => {
    it('should show help message', done => {
      coffee.fork(myBin, [ '--help' ], { cwd })
        // .debug()
        .expect('stdout', /Commands:\s*\n/)
        .expect('stdout', /test\s*unit test.*aliases: cov/)
        .expect('stdout', /start\s*start app/)
        .expect('stdout', /Examples:\s*\n/)
        .expect('stdout', /Usage: my-bin <command>/)
        .expect('stdout', /my-bin start\s*--baseDir=..\/dist.*run app at dist dir/)
        .expect('code', 0)
        .end(done);
    });

    it('should show help message with short alias -h', done => {
      coffee.fork(myBin, [ '-h' ], { cwd })
        // .debug()
        .expect('stdout', /Commands:\s*\n/)
        .expect('stdout', /test\s*unit test.*aliases: cov/)
        .expect('stdout', /start\s*start app/)
        .expect('stdout', /Examples:\s*\n/)
        .expect('stdout', /Usage: my-bin <command>/)
        .expect('stdout', /my-bin start\s*--baseDir=..\/dist.*run app at dist dir/)
        .expect('code', 0)
        .end(done);
    });

    it('should show version 2.0.0', done => {
      coffee.fork(myBin, [ '--version' ], { cwd })
        // .debug()
        .expect('stdout', '2.0.0\n')
        .expect('code', 0)
        .end(done);
    });
  });

  describe('command', () => {
    it('should `my-bin start` success', done => {
      coffee.fork(myBin, [ 'start', '--baseDir=abc' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run start command at .*fixtures\/test-files with abc/)
        .expect('stdout', /rawArgv: \["--baseDir=abc"]/)
        .expect('code', 0)
        .end(done);
    });

    it('should `my-bin test` success', done => {
      coffee.fork(myBin, [ 'test', '--require=co-mocha' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run mocha test at .*fixtures\/test-files with co-mocha/)
        .expect('stdout', /rawArgv: \["--require=co-mocha"]/)
        .expect('stdout', /node version: v\d+\.\d+\.\d+/)
        .expect('code', 0)
        .end(done);
    });

    it('should echo with helper fn `my-bin echo --name=bin`', done => {
      coffee.fork(myBin, [ 'echo', '--name=bin' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /hi, bin china/)
        .expect('code', 0)
        .end(done);
    });

    it('should catch `my-bin error`', done => {
      coffee.fork(myBin, [ 'error' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stderr', /\[my-bin] run command \[error] with \[] at .* got error/)
        .expect('stderr', /something wrong with error-command/)
        .expect('code', 1)
        .end(done);
    });
  });

  describe('command dir', () => {
    it('should `my-bin debug` success', done => {
      coffee.fork(myBin, [ 'debug' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run debug command at .*fixtures\/test-files/)
        .expect('code', 0)
        .end(done);
    });

    it('should `my-bin init` success', done => {
      coffee.fork(myBin, [ 'init' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run init command at .*fixtures\/test-files/)
        .expect('code', 0)
        .end(done);
    });
  });
});
