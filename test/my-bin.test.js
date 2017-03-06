'use strict';

const path = require('path');
const rimraf = require('rimraf');
const coffee = require('coffee');

describe('test/my-bin.test.js', () => {
  const myBin = require.resolve('./fixtures/my-bin/bin/my-bin.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  after(() => rimraf.sync(path.join(cwd, 'node_modules')));

  describe('global options', () => {
    it('my-bin --help', done => {
      coffee.fork(myBin, [ '--help' ], { cwd })
        .debug()
        .expect('stdout', /Usage: my-bin <command> \[options]/)
        .expect('stdout', /Commands:/)
        .expect('stdout', /add <type> <name>.*add a controller.*aliases: create/)
        .notExpect('stdout', /start-cluster/)
        .notExpect('stdout', /not-register/)
        .expect('stdout', /Options:/)
        .expect('stdout', /-h, --help.*Show help.*boolean/)
        .expect('code', 0)
        .end(done);
    });

    it('my-bin -h', done => {
      coffee.fork(myBin, [ '-h' ], { cwd })
        // .debug()
        .expect('stdout', /Usage: my-bin <command> \[options]/)
        .expect('stdout', /Commands:/)
        .expect('stdout', /Options:/)
        .expect('code', 0)
        .end(done);
    });

    it('my-bin --version', done => {
      coffee.fork(myBin, [ '--version' ], { cwd })
        // .debug()
        .expect('stdout', '2.0.0\n')
        .expect('code', 0)
        .end(done);
    });
  });

  describe('command', () => {
    it('my-bin start', done => {
      coffee.fork(myBin, [ 'start', '--baseDir=abc' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run start command at abc with port 7001/)
        .expect('stdout', /start server with \["--port","7001"]/)
        .expect('code', 0)
        .end(done);
    });

    it('my-bin start --port', done => {
      coffee.fork(myBin, [ 'start', '--port=8000' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run start command at .*test-files with port 8000/)
        .expect('stdout', /start server with \["--port","8000"]/)
        .expect('code', 0)
        .end(done);
    });

    it('my-bin add contoller test', done => {
      coffee.fork(myBin, [ 'add', 'controller', 'test' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /add controller test with class style/)
        .expect('code', 0)
        .end(done);
    });

    it('should support alias - `my-bin create contoller test`', done => {
      coffee.fork(myBin, [ 'create', 'controller', 'test' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /add controller test with class style/)
        .expect('code', 0)
        .end(done);
    });

    it('should support arguments - `my-bin add service test --style=exports`', done => {
      coffee.fork(myBin, [ 'add', 'service', 'test', '--style=exports' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /add service test with exports style/)
        .expect('code', 0)
        .end(done);
    });

    it('should validate arguments - `my-bin add service`', done => {
      coffee.fork(myBin, [ 'add', 'service' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stderr', /Not enough non-option arguments/)
        .expect('code', 1)
        .end(done);
    });

    it('should check option value - `my-bin add service test --style=abc`', done => {
      coffee.fork(myBin, [ 'add', 'service', 'test', '--style=abc' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stderr', /Invalid values/)
        .expect('code', 1)
        .end(done);
    });

    it('should catch `my-bin error`', done => {
      coffee.fork(myBin, [ 'error', '--test=abc' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stderr', /\[my-bin] run command error with \["--test=abc"].*got error: something wrong with error-command/)
        .expect('code', 1)
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
