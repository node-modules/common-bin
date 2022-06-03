'use strict';

const path = require('path');
const coffee = require('coffee');

describe('test/my-git.test.js', () => {
  const myBin = require.resolve('./fixtures/my-git/bin/my-git.js');
  const cwd = path.join(__dirname, 'fixtures/test-files');
  const repository = 'git@github.com:node-modules/common-bin';

  describe('global options', () => {
    it('my-git --help', () => {
      return coffee.fork(myBin, [ '--help' ], { cwd })
        // .debug()
        .expect('stdout', /Usage: my-git <command> \[options]/)
        .expect('stdout', /clone.*Clone a repository into a new directory/)
        .expect('stdout', /remote.*Manage set of tracked repositories/)
        .expect('stdout', /Options:/)
        .expect('stdout', /-h, --help.*/)
        .expect('stdout', /--version.*/)
        .expect('code', 0)
        .end();
    });

    it('my-git -h', () => {
      return coffee.fork(myBin, [ '-h' ], { cwd })
        // .debug()
        .expect('stdout', /Usage: my-git <command> \[options]/)
        .expect('stdout', /Options:/)
        .expect('code', 0)
        .end();
    });

    it('my-git -h remote', () => {
      return coffee.fork(myBin, [ '-h', 'remote' ], { cwd })
        // .debug()
        .expect('stdout', /Usage: my-git remote/)
        .expect('stdout', /add\s*Adds a remote/)
        .expect('stdout', /remove\s*Remove the remote/)
        .expect('code', 0)
        .end();
    });

    it('my-git', () => {
      return coffee.fork(myBin, [], { cwd })
        // .debug()
        .expect('stdout', /Usage: my-git <command> \[options]/)
        .expect('stdout', /Options:/)
        .expect('code', 0)
        .end();
    });

    it('my-git --version', () => {
      return coffee.fork(myBin, [ '--version' ], { cwd })
        // .debug()
        .expect('stdout', '2.0.0\n')
        .expect('code', 0)
        .end();
    });
  });

  describe('command clone', () => {
    // https://github.com/yargs/yargs/issues/570
    it.skip('my-git clone <repository>', () => {
      return coffee.fork(myBin, [ 'clone', repository, 'common-bin', '--depth=1' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /git clone .*node-modules\/common-bin to common-bin with depth 1/)
        .expect('code', 0)
        .end();
    });

    it.skip('should validate arguments - `my-git clone`', () => {
      return coffee.fork(myBin, [ 'clone' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stderr', /Options:/)
        .expect('stderr', /Not enough non-option arguments/)
        .expect('code', 1)
        .end();
    });

    it('my-git clone --help', () => {
      return coffee.fork(myBin, [ 'clone', '--help' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /Options:/)
        .expect('stdout', /--depth\s*Create a shallow.*\[.*?]/)
        .expect('code', 0)
        .end();
    });
  });

  describe('command remote', () => {
    it('my-git remote --help', () => {
      return coffee.fork(myBin, [ 'remote', '--help' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /Usage:.*remote <add\/remove>/)
        .expect('stdout', /add\s*Adds a remote named/)
        .expect('stdout', /remove\s*Remove.*/)
        // .expect('stdout', /remove <name>\s*Remove.*\[aliases: rm]/)
        .expect('stdout', /Options:/)
        .expect('code', 0)
        .end();
    });

    it('my-git remote add --help', () => {
      return coffee.fork(myBin, [ 'remote', 'add', '--help' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /Usage:.*remote add <name> <url>/)
        .expect('stdout', /Options:/)
        .expect('stdout', /--tags.*imports every tag/)
        .expect('code', 0)
        .end();
    });

    it('my-git remote add upstream <repository>', () => {
      return coffee.fork(myBin, [ 'remote', 'add', 'upstream', repository ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /git remote add upstream to .*node-modules\/common-bin with tags=false/)
        .expect('code', 0)
        .end();
    });

    it('my-git remote remove upstream', () => {
      return coffee.fork(myBin, [ 'remote', 'remove', 'upstream' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /git remote remove upstream/)
        .expect('code', 0)
        .end();
    });

    it('my-git remote rm upstream', () => {
      return coffee.fork(myBin, [ 'remote', 'rm', 'upstream' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /git remote remove upstream/)
        .expect('code', 0)
        .end();
    });

    it('should exec `run` when not sub command match - `my-git remote no-exist`', () => {
      return coffee.fork(myBin, [ 'remote', 'no-exist' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /run remote command with \["no-exist"]/)
        .expect('code', 0)
        .end();
    });
  });

  describe('bash-completion', () => {
    it('--get-yargs-completions my-git', () => {
      return coffee.fork(myBin, [ '--get-yargs-completions', 'my-git' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /completion/)
        .expect('stdout', /clone/)
        .expect('stdout', /remote/)
        .notExpect('stdout', /Usage:/)
        .expect('code', 0)
        .end();
    });

    it('--get-yargs-completions my-git remote', () => {
      return coffee.fork(myBin, [ '--get-yargs-completions', 'my-git', 'remote' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /completion/)
        .expect('stdout', /add/)
        .expect('stdout', /remove/)
        .expect('stdout', /rm/)
        .notExpect('stdout', /Usage:/)
        .expect('code', 0)
        .end();
    });

    it('--get-yargs-completions my-git remote add', () => {
      return coffee.fork(myBin, [ '--get-yargs-completions', 'my-git', 'remote', 'add', '-' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /--tags/)
        .notExpect('stdout', /Usage:/)
        .expect('code', 0)
        .end();
    });

    it('--get-yargs-completions my-git remote add', () => {
      return coffee.fork(myBin, [ '--get-yargs-completions', 'my-git', 'remote', 'add', '--' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /--tags/)
        .notExpect('stdout', /Usage:/)
        .expect('code', 0)
        .end();
    });
  });
});
