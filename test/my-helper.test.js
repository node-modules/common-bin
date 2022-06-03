'use strict';

const path = require('path');
const coffee = require('coffee');
const helper = require('../lib/helper');
const yargs = require('yargs');
const assert = require('assert');

describe('test/my-helper.test.js', () => {
  const myBin = require.resolve('./fixtures/my-helper/bin/my-helper.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  it('my-helper --help', () => {
    return coffee.fork(myBin, [ '--help' ], { cwd })
      // .debug()
      .expect('stdout', /fork/)
      .expect('stdout', /install/)
      .expect('stdout', /echo/)
      .expect('stdout', /Options:/)
      .expect('stdout', /--help/)
      .expect('code', 0)
      .end();
  });

  it('should `helper.echo`', () => {
    return coffee.fork(myBin, [ 'echo', 'tz' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /hi, tz/)
      .expect('code', 0)
      .end();
  });

  it('should `helper.forkNode`', () => {
    return coffee.fork(myBin, [ 'fork', '--target=test_script' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /task proc: true/)
      .expect('stdout', /process.argv: \["--target=test_script","--from=test"]/)
      .expect('code', 0)
      .end();
  });

  it('should `helper.callFn`', () => {
    return coffee.fork(myBin, [ 'call' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /undefined, promise/)
      .expect('code', 0)
      .end();
  });

  it('should `helper.forkNode` with error', () => {
    return coffee.fork(myBin, [ 'fork', '--target=error_script' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stderr', /this is an error/)
      .expect('stderr', /Command Error/)
      .expect('code', 1)
      .end();
  });

  it.skip('should kill child process', done => {
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
    }, 10000);
  });

  it('should `helper.npmInstall`', () => {
    return coffee.fork(myBin, [ 'install', '--target=egg-init-config' ], { cwd, env: process.env })
      // .debug()
      // .coverage(false);
      // npm@5 missing the message
      // .expect('stdout', /egg-init-config@\d+\.\d+\.\d+/)
      .expect('stdout', /install egg-init-config done/)
      .expect('code', 0)
      .end();
  });

  it('should `helper.npmInstall` with error', () => {
    return coffee.fork(myBin, [ 'install', '--target=common-bin-not-exist' ], { cwd, env: process.env })
      // .debug()
      // .coverage(false);
      .expect('stdout', /npm.* i common-bin-not-exist/)
      .expect('stderr', /npm ERR! 404/)
      .expect('code', 1)
      .end();
  });

  it('helper.unparseArgv', () => {
    const args = [
      'echo',
      '--baseDir=./dist',
      '--debug=5555', '--debug-brk',
      '--inspect', '6666', '--inspect-brk',
      '--es_staging', '--harmony', '--harmony_default_parameters',
    ];
    const argv = yargs.parse(args);
    const execArgv = helper.unparseArgv(argv, {
      includes: [ 'debug', /^harmony.*/ ],
    });
    assert.deepEqual(execArgv, [ '--debug=5555', '--harmony', '--harmony_default_parameters' ]);
  });

  it('helper.extractExecArgv', () => {
    const args = [
      'echo',
      '--baseDir=./dist',
      '--debug=5555', '--debug-brk',
      '--inspect', '6666', '--inspect-brk=7777',
      '--inspect-port', '--debug-port=8888',
      '--debug-invalid',
      '--es_staging', '--harmony', '--harmony_default_parameters',
    ];
    const argv = yargs.parse(args);
    const { debugPort, debugOptions, execArgvObj } = helper.extractExecArgv(argv);
    assert(debugPort === 8888);
    assert.deepEqual(debugOptions, { debug: 5555, 'debug-brk': true, inspect: 6666, 'inspect-brk': 7777, 'inspect-port': true, 'debug-port': 8888 });
    assert.deepEqual(execArgvObj, { debug: 5555, 'debug-brk': true, inspect: 6666, 'inspect-brk': 7777, 'inspect-port': true, 'debug-port': 8888, es_staging: true, harmony: true, harmony_default_parameters: true });
  });
});
