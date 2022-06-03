'use strict';

const path = require('path');
const fs = require('fs');
const coffee = require('coffee');

describe('test/my-bin.test.js', () => {
  const myBin = require.resolve('./fixtures/my-bin/bin/my-bin.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  after(() => fs.rmSync(path.join(cwd, 'node_modules'), { force: true, recursive: true }));

  describe('global options', () => {
    it('my-bin --help', () => {
      return coffee.fork(myBin, [ '--help' ], { cwd })
        // .debug()
        .expect('stdout', /Usage: my-bin <command> \[options]/)
        .expect('stdout', /start.*start app/)
        .expect('stdout', /test.*test app/)
        .notExpect('stdout', /start-cluster/)
        .notExpect('stdout', /not-register/)
        .expect('stdout', /Options:/)
        .expect('stdout', /-h, --help.*/)
        .expect('code', 0)
        .end();
    });

    it('my-bin -h', () => {
      return coffee.fork(myBin, [ '-h' ], { cwd })
        // .debug()
        .expect('stdout', /Usage: my-bin <command> \[options]/)
        .expect('stdout', /Options:/)
        .expect('code', 0)
        .end();
    });

    it('my-bin --version', () => {
      return coffee.fork(myBin, [ '--version' ], { cwd })
        // .debug()
        .expect('stdout', '1.2.2\n')
        .expect('code', 0)
        .end();
    });
  });

  describe('command', () => {
    it('my-bin start', () => {
      return coffee.fork(myBin, [ 'start' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run start command at .*test-files with port 7001/)
        .expect('stdout', /start server with \["--port","7001"]/)
        .expect('code', 0)
        .end();
    });

    it('my-bin start throw error with error argv', () => {
      return coffee.fork(myBin, [ 'start', '--env', 'foo' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stderr', /YError:/)
        .expect('stderr', /.*env.*"foo".*"test"/)
        .expect('code', 1)
        .end();
    });

    it('my-bin begin', () => {
      return coffee.fork(myBin, [ 'begin' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run start command at .*test-files with port 7001/)
        .expect('stdout', /start server with \["--port","7001"]/)
        .expect('code', 0)
        .end();
    });

    it('my-bin start --port', () => {
      return coffee.fork(myBin, [ 'start', '--port=8000' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run start command at .*test-files with port 8000/)
        .expect('stdout', /start server with \["--port","8000"]/)
        .expect('code', 0)
        .end();
    });

    it('my-bin test', () => {
      return coffee.fork(myBin, [ 'test' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run test command at .*test-files/)
        .expect('code', 0)
        .end();
    });

    it('should catch `my-bin error`', () => {
      return coffee.fork(myBin, [ 'error', '--test=abc' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stderr', /Command Error/)
        .expect('code', 1)
        .end();
    });

    it('my-bin parserDebug', () => {
      const args = [
        'parserDebug',
        '--baseDir=./dist',
        '--debug', '--debug-brk=5555',
        '--expose_debug_as=v8debug',
        '--inspect', '6666', '--inspect-brk',
        '--debug-invalid',
      ];
      return coffee.fork(myBin, args, { cwd })
        // .debug()
        // .coverage(false)
        .notExpect('stdout', /"b":".\/dist"/)
        .expect('stdout', /"baseDir":".\/dist"/)
        .expect('stdout', /"debug-invalid":true,"debugInvalid":true/)
        .notExpect('stdout', /argv: {.*"debug-brk":5555,/)
        .notExpect('stdout', /argv: {.*"debugBrk":5555,/)
        .expect('stdout', /execArgv: --debug,--debug-brk=5555,--expose_debug_as=v8debug,--inspect=6666,--inspect-brk/)
        .expect('stdout', /debugPort: 6666/)
        .expect('stdout', /debugOptions: {"debug":true,"debug-brk":5555,"inspect":6666,"inspect-brk":true}/)
        .expect('code', 0)
        .end();
    });

    it('my-bin parserRequire', () => {
      const args = [
        'parserRequire',
      ];
      return coffee.fork(myBin, args, { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /execArgv: \["--require","abc"]/)
        .expect('stdout', /execArgv: \["--require","abc","--require","123"]/)
        .expect('stdout', /execArgv: \["--require",".*?test-files([/|\\])+a.js","--require","\/b\.js"]/)
        .expect('code', 0)
        .end();
    });

    it('my-bin parserDebug without execArgv', () => {
      const args = [
        'parserDebug',
        '--baseDir=./dist',
        '--debug-invalid',
      ];
      return coffee.fork(myBin, args, { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /"debug-invalid":true,"debugInvalid":true/)
        .expect('stdout', /execArgv.length: 0/)
        .expect('stdout', /debugPort: undefined/)
        .expect('stdout', /debugOptions: undefined/)
        .expect('code', 0)
        .end();
    });

    it('my-bin parserDebug convert --node-options--xxx to execArgv', () => {
      const args = [
        'parserDebug',
        '--baseDir=./dist',
        '--node-options--trace-warnings',
      ];
      return coffee.fork(myBin, args, { cwd })
        // .debug()
        .expect('stdout', /execArgv.length: 1/)
        .expect('stdout', /execArgv: --trace-warnings/)
        .expect('code', 0)
        .end();
    });

    it('my-bin parserDebug $NODE_DEBUG_OPTION without port', () => {
      const args = [
        'parserDebug',
        '--baseDir=./dist',
        '--debug-port=5555',
      ];
      return coffee.fork(myBin, args, { cwd, env: Object.assign({}, process.env, { NODE_DEBUG_OPTION: '--debug-brk --expose_debug_as=v8debug' }) })
        // .debug()
        // .coverage(false)
        .notExpect('stdout', /argv: {.*"debug-brk"/)
        .notExpect('stdout', /argv: {.*"debugBrk"/)
        .expect('stdout', /execArgv: --debug-port=5555,--debug-brk,--expose_debug_as=v8debug/)
        .expect('stdout', /debugPort: 5555/)
        .expect('stdout', /debugOptions: {"debug-port":5555,"debug-brk":true}/)
        .expect('code', 0)
        .end();
    });

    it('my-bin parserDebug $NODE_DEBUG_OPTION 6.x', () => {
      const args = [
        'parserDebug',
        '--baseDir=./dist',
        '--debug-port=5555',
      ];
      return coffee.fork(myBin, args, { cwd, env: Object.assign({}, process.env, { NODE_DEBUG_OPTION: '--debug-brk=6666 --expose_debug_as=v8debug' }) })
        // .debug()
        // .coverage(false)
        .notExpect('stdout', /argv: {.*"debug-brk"/)
        .notExpect('stdout', /argv: {.*"debugBrk"/)
        .expect('stdout', /execArgv: --debug-port=5555,--debug-brk=6666,--expose_debug_as=v8debug/)
        .expect('stdout', /debugPort: 6666/)
        .expect('stdout', /debugOptions: {"debug-port":5555,"debug-brk":6666}/)
        .expect('code', 0)
        .end();
    });

    it('my-bin parserDebug $NODE_DEBUG_OPTION 8.x', () => {
      const args = [
        'parserDebug',
        '--baseDir=./dist',
        '--debug-port=5555',
      ];
      return coffee.fork(myBin, args, { cwd, env: Object.assign({}, process.env, { NODE_DEBUG_OPTION: '--inspect-brk=6666' }) })
        // .debug()
        // .coverage(false)
        .notExpect('stdout', /argv: {.*"inspect-brk"/)
        .notExpect('stdout', /argv: {.*"inspectBrk"/)
        .expect('stdout', /execArgv: --debug-port=5555,--inspect-brk=6666/)
        .expect('stdout', /debugPort: 6666/)
        .expect('stdout', /debugOptions: {"debug-port":5555,"inspect-brk":6666}/)
        .expect('code', 0)
        .end();
    });

    it('my-bin parserDebug warn --expose_debug_as at 7.x+', () => {
      const args = [
        'parserDebug',
        '--baseDir=./dist',
        '--debug-port=5555',
      ];
      return coffee.fork(myBin, args, { cwd, env: Object.assign({}, process.env, { NODE_DEBUG_OPTION: '--debug-brk=6666 --expose_debug_as=v8debug' }) })
        // .debug()
        // .coverage(false)
        .beforeScript(path.join(__dirname, 'fixtures/mock-node.js'))
        .expect('stderr', /Node.js runtime is \d+.\d+.\d+, and inspector protocol is not support --expose_debug_as/)
        .notExpect('stdout', /argv: {.*"debug-brk"/)
        .notExpect('stdout', /argv: {.*"debugBrk"/)
        .expect('stdout', /execArgv: --debug-port=5555,--debug-brk=6666,--expose_debug_as=v8debug/)
        .expect('stdout', /debugPort: 6666/)
        .expect('stdout', /debugOptions: {"debug-port":5555,"debug-brk":6666}/)
        .expect('code', 0)
        .end();
    });

    it('my-bin parserOptions', () => {
      const args = [
        'parserOptions',
        '--baseDir=./dist',
        '--debug', '--debug-brk=5555',
        '--expose_debug_as=v8debug',
        '--inspect', '6666', '--inspect-brk',
        '--es_staging', '--harmony', '--harmony_default_parameters',
      ];
      return coffee.fork(myBin, args, { cwd })
        // .debug()
        // .coverage(false)
        .notExpect('stdout', /"b":".\/dist"/)
        .expect('stdout', /"base-dir":".\/dist"/)
        .notExpect('stdout', /"debug-brk":5555,/)
        .notExpect('stdout', /"debugBrk":5555,/)
        .expect('stdout', /execArgv: --debug,--debug-brk=5555,--expose_debug_as=v8debug,--inspect=6666,--inspect-brk,--es_staging,--harmony,--harmony_default_parameters/)
        .expect('stdout', /debugPort: 6666/)
        .expect('code', 0)
        .end();
    });

    it('my-bin context', () => {
      const args = [
        'context',
        '--baseDir=./dist',
        '--debug', '--debug-brk=5555',
        '--expose_debug_as=v8debug',
        '--inspect', '6666', '--inspect-brk',
        '--es_staging', '--harmony', '--harmony_default_parameters',
      ];
      return coffee.fork(myBin, args, { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /"b":".\/dist"/)
        .expect('stdout', /"baseDir":".\/dist"/)
        .expect('stdout', /"debug-brk":5555,/)
        .expect('stdout', /"debugBrk":5555,/)
        .expect('stdout', /execArgv: undefined/)
        .expect('code', 0)
        .end();
    });

    it('my-bin class', () => {
      return coffee.fork(myBin, [ 'class' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /add by class/)
        .expect('code', 0)
        .end();
    });
  });

  describe('override', () => {
    it('`my-bin cov` when NOT at win32', () => {
      return coffee.fork(myBin, [ 'cov' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run cov command/)
        .expect('code', 0)
        .end();
    });

    it('`my-bin cov` will be replace by `test` when at win32', () => {
      return coffee.fork(myBin, [ 'cov' ], {
        cwd,
        env: {
          platform: 'win32',
        },
      })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run test command/)
        .expect('code', 0)
        .end();
    });
  });
});
