'use strict';

const path = require('path');
const rimraf = require('rimraf');
const coffee = require('coffee');
const mm = require('mm');

describe('test/my-bin.test.js', () => {
  const myBin = require.resolve('./fixtures/my-bin/bin/my-bin.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  after(() => rimraf.sync(path.join(cwd, 'node_modules')));

  afterEach(mm.restore);

  describe('global options', () => {
    it('my-bin --help', done => {
      coffee.fork(myBin, [ '--help' ], { cwd })
        // .debug()
        .expect('stdout', /Usage: my-bin <command> \[options]/)
        .expect('stdout', /Commands:/)
        .expect('stdout', /start.*start app/)
        .expect('stdout', /test.*test app/)
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
      coffee.fork(myBin, [ 'start' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run start command at .*test-files with port 7001/)
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

    it('my-bin test', done => {
      coffee.fork(myBin, [ 'test' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run test command at .*test-files/)
        .expect('code', 0)
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

  describe('override', () => {
    it('my-bin cov when NOT at win32', done => {
      coffee.fork(myBin, [ 'cov' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run cov command/)
        .expect('code', 0)
        .end(done);
    });

    it('my-bin cov when at win32', done => {
      coffee.fork(myBin, [ 'cov' ], {
        cwd,
        env: {
          platform: 'win32',
        },
      })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run test command/)
        .expect('code', 0)
        .end(done);
    });

    it.only('`my-bin --help` when at win32', done => {
      coffee.fork(myBin, [ '--help' ], {
        cwd,
        env: {
          platform: 'win32',
        },
      })
        .debug()
        // .coverage(false)
        .expect('stdout', /run test command/)
        .expect('code', 0)
        .end(done);
    });
  });
});
