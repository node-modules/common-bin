'use strict';

const path = require('path');
const coffee = require('coffee');
const helper = require('../lib/helper');
const yargs = require('yargs');
const assert = require('assert');

describe('test/my-helper.test.js', () => {
  const myBin = require.resolve('./fixtures/my-helper/bin/my-helper.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  it('my-helper --help', done => {
    coffee.fork(myBin, [ '--help' ], { cwd })
      // .debug()
      .expect('stdout', /Commands:/)
      .expect('stdout', /fork/)
      .expect('stdout', /install/)
      .expect('stdout', /echo/)
      .expect('stdout', /Options:/)
      .expect('stdout', /--help/)
      .expect('code', 0)
      .end(done);
  });

  it('should `helper.echo`', done => {
    coffee.fork(myBin, [ 'echo', 'tz' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /hi, tz/)
      .expect('code', 0)
      .end(done);
  });

  it('should `helper.forkNode`', done => {
    coffee.fork(myBin, [ 'fork', '--target=test_script' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /process.argv: \["--target=test_script","--from=test"]/)
      .expect('code', 0)
      .end(done);
  });

  it('should `helper.callFn`', done => {
    coffee.fork(myBin, [ 'call' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /undefined, promise, generator/)
      .expect('code', 0)
      .end(done);
  });

  it('should `helper.forkNode` with error', done => {
    coffee.fork(myBin, [ 'fork', '--target=error_script' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stderr', /this is an error/)
      .expect('stderr', /Command Error/)
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
    }, 10000);
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

  it('should `helper.npmInstall` with error', done => {
    coffee.fork(myBin, [ 'install', '--target=common-bin-not-exist' ], { cwd, env: process.env })
      // .debug()
      // .coverage(false);
      .expect('stdout', /npm.* i common-bin-not-exist/)
      .expect('stderr', /npm ERR! 404/)
      .expect('code', 1)
      .end(done);
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
});
