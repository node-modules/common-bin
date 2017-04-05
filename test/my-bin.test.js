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

    it('my-bin begin', done => {
      coffee.fork(myBin, [ 'begin' ], { cwd })
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
        .expect('stderr', /run command --test=abc got error: something wrong/)
        .expect('code', 1)
        .end(done);
    });

    it('my-bin parserOptions', done => {
      const args = [
        'parserOptions',
        '--baseDir=./dist',
        '--debug', '--debug-brk=5555',
        '--expose_debug_as=v8debug',
        '--inspect', '6666', '--inspect-brk',
        '--es_staging', '--harmony', '--harmony_default_parameters',
      ];
      coffee.fork(myBin, args, { cwd })
        // .debug()
        // .coverage(false)
        .notExpect('stdout', /"b":".\/dist"/)
        .expect('stdout', /"baseDir":".\/dist"/)
        .notExpect('stdout', /"debug-brk":5555,/)
        .notExpect('stdout', /"debugBrk":5555,/)
        .expect('stdout', /execArgv: --debug,--debug-brk=5555,--expose_debug_as=v8debug,--inspect=6666,--inspect-brk,--es_staging,--harmony,--harmony_default_parameters/)
        .expect('stdout', /debugPort: 6666/)
        .expect('code', 0)
        .end(done);
    });

    it('my-bin context', done => {
      const args = [
        'context',
        '--baseDir=./dist',
        '--debug', '--debug-brk=5555',
        '--expose_debug_as=v8debug',
        '--inspect', '6666', '--inspect-brk',
        '--es_staging', '--harmony', '--harmony_default_parameters',
      ];
      coffee.fork(myBin, args, { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /"b":".\/dist"/)
        .expect('stdout', /"baseDir":".\/dist"/)
        .expect('stdout', /"debug-brk":5555,/)
        .expect('stdout', /"debugBrk":5555,/)
        .expect('stdout', /execArgv: undefined/)
        .expect('code', 0)
        .end(done);
    });

    it('my-bin class', done => {
      coffee.fork(myBin, [ 'class' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /add by class/)
        .expect('code', 0)
        .end(done);
    });
  });

  describe('override', () => {
    it('`my-bin cov` when NOT at win32', done => {
      coffee.fork(myBin, [ 'cov' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run cov command/)
        .expect('code', 0)
        .end(done);
    });

    it('`my-bin cov` will be replace by `test` when at win32', done => {
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
  });
});
