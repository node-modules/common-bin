'use strict';

const path = require('path');
const coffee = require('coffee');
const mm = require('mm');

describe('test/es-module-bin.test.js', () => {
  afterEach(mm.restore);

  const myBin = require.resolve('./fixtures/es-module-bin/bin/es-module-bin.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');

  it('es-module-bin --help', () => {
    return coffee.fork(myBin, [ '--help' ], { cwd })
      // .debug()
      .expect('stdout', /Options:/)
      .expect('stdout', /-h, --help.*/)
      .expect('code', 0)
      .end();
  });

  it('es-module-bin start', () => {
    return coffee.fork(myBin, [ 'start' ], { cwd })
      // .debug()
      // .coverage(false)
      .expect('stdout', /override start command/)
      .expect('code', 0)
      .end();
  });
});
