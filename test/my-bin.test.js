'use strict';

const path = require('path');
const rimraf = require('rimraf');
const coffee = require('coffee');

describe('test/my-bin.test.js', () => {
  const myBin = require.resolve('./fixtures/my-bin/bin/my-bin.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  after(() => rimraf.sync(path.join(cwd, 'node_modules')));

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
        .expect('stdout', /Options:\s*\n/)
        .expect('stdout', /--version\s*Show version number/)
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

    it('should show version 2.0.0 with short alias -V', done => {
      coffee.fork(myBin, [ '-V' ], { cwd })
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
        .expect('stdout', /run start command at .*test-files with abc/)
        .expect('stdout', /rawArgv: \["--baseDir=abc"]/)
        .expect('code', 0)
        .end(done);
    });

    it('should `my-bin test` success', done => {
      coffee.fork(myBin, [ 'test', '--require=co-mocha' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run mocha test at .*test-files with co-mocha/)
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
        .expect('stderr', /\[my-bin] run command \[error] with \[].*got error/)
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
        .expect('stdout', /run debug command at .*test-files/)
        .expect('code', 0)
        .end(done);
    });

    it('should `my-bin init` success', done => {
      coffee.fork(myBin, [ 'init' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run init command at .*test-files/)
        .expect('code', 0)
        .end(done);
    });
  });

  describe('helper', () => {
    it('should `helper.forkNode`', done => {
      coffee.fork(myBin, [ 'fork', '--target=test_script' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /process.argv: \["--target=test_script","--from=test"]/)
        .expect('code', 0)
        .end(done);
    });

    it('should `helper.forkNode` with error', done => {
      coffee.fork(myBin, [ 'fork', '--target=error_script' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stderr', /this is an error/)
        .expect('stderr', /error_script --target=error_script,--from=test exit with code 1/)
        .expect('code', 1)
        .end(done);
    });

    it('should kill child process', done => {
      const app = coffee.fork(myBin, [ 'fork', '--target=loop_script' ], { cwd, env: process.env });
      app
        // .debug()
        // .coverage(false);
        .expect('stdout', /\[child] echo \d+ 1/)
        .expect('stdout', /\[child] echo \d+ 2/);

      if (process.platform !== 'win32') {
        app
          .expect('stdout', /\[child] exit with code 0/)
          .expect('stdout', /recieve singal SIGINT/)
          .expect('code', 0);
      }

      app.end(done);

      setTimeout(() => {
        app.proc.kill('SIGINT');
      }, 3000);
    });

    it('should `helper.npmInstall`', done => {
      coffee.fork(myBin, [ 'install', '--target=egg-init-config' ], { cwd, env: process.env })
        // .debug()
        // .coverage(false);
        .expect('stdout', /egg-init-config@\d+\.\d+\.\d+/)
        .expect('stdout', /install egg-init-config done/)
        .expect('code', 0)
        .end(done);
    });
  });

});
