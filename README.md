# common-bin

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/common-bin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/common-bin
[travis-image]: https://img.shields.io/travis/node-modules/common-bin.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/common-bin
[codecov-image]: https://codecov.io/gh/node-modules/common-bin/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/node-modules/common-bin
[david-image]: https://img.shields.io/david/node-modules/common-bin.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/common-bin
[snyk-image]: https://snyk.io/test/npm/common-bin/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/common-bin
[download-image]: https://img.shields.io/npm/dm/common-bin.svg?style=flat-square
[download-url]: https://npmjs.org/package/common-bin

Abstraction bin tool wrap [yargs](http://yargs.js.org/), to provide more convenient usage, support async / generator.

---

## Install

```bash
$ npm i common-bin --save-dev
```

## Build a bin tool for your team

You maybe need a custom xxx-bin to implement more custom features.

Now you can implement a [Program](lib/program.js) sub class, and [Command](lib/command.js) sub class to do that.

### Example: Write your own `git` command

This example will show you how to create a new `my-git` tool.

- Full demo: [my-git](test/fixtures/my-git)

```bash
test/fixtures/my-git
├── bin
│   └── my-git.js
├── command
│   ├── remote
│   │   ├── add.js
│   │   └── remove.js
│   ├── clone.js
│   └── remote.js
├── index.js
└── package.json
```

#### [my-git.js](test/fixtures/my-git/bin/my-git.js)

```js
#!/usr/bin/env node

'use strict';

const Command = require('..');
new Command().start();
```

#### [Main Command](test/fixtures/my-git/index.js)

Just extend `Command`, and use as your bin start point.
- need to provide `name` and `usage` for bin config.
- You can use `this.yargs` to custom yargs config, see http://yargs.js.org/docs for more detail.

```js
const Command = require('common-bin');
const pkg = require('./package.json';

class MainCommand extends Command {
  constructor() {
    super();
    this.name = pkg.name;
    this.usage = `Usage: ${this.name} <command> [options]`;

    // load entire command directory
    this.loadCommand(path.join(__dirname, 'command'));

    // or load special command file
    // this.addCommand(path.join(__dirname, 'test_command.js'));

    // more custom with `yargs` api, such as you can use `my-git -V`
    this.yargs.alias('V', 'version');
  }
}

module.exports = MainCommand;
```

#### [CloneCommand](test/fixtures/my-git/command/clone.js)

```js
const Command = require('common-bin');
class CloneCommand extends Command {
  constructor() {
    super();
    this.name = 'clone <repository> [directory]';
    this.description = 'Clone a repository into a new directory';

    this.options = {
      depth: {
        type: 'number',
        description: 'Create a shallow clone with a history truncated to the specified number of commits',
      },
    };
  }

  * run({ argv }) {
    console.log('git clone %s to %s with depth %d', argv.repository, argv.directory, argv.depth);
  }
}

module.exports = CloneCommand;
```

#### Run result

```bash
$ my-git clone gh://node-modules/common-bin dist --depth=1

git clone gh://node-modules/common-bin to dist with depth 1
```

## Concept

### Command

Define the main logic of command

**Method:**

- `start()` - start your program, only use once in your bin file.
- `run(context)`
  - should implement this to provide command handler, will exec when not found sub command.
  - Support generator / async function / normal function which return promise.
  - `context` is `{ cwd, argv, rawArgv}`
    - `cwd` - `process.cwd()`
    - `argv` - argv parse result by yargs, `{ _: [ 'start' ], '$0': '/usr/local/bin/common-bin', baseDir: 'simple'}`
    - `rawArgv` - the raw argv, `[ "--baseDir=simple" ]`
- `loadCommand(...args)` - register the entire directory to commands, `args` will join by `path.join`
- `addCommand(filePath)` - register special file with extname to command.
- `showHelp()` - print usage message to console.

**Properties:**

- `name` - {String} the command name
  - must provide this property
  - accept optional and required positional arguments, such as `clone <repository> [directory]`
  - if this command is the main command, it's name will set as bin name.
- `aliases` - {Array|String} the command aliases
- `description` - {String} command description in help text, **left to empty will act like a hidden command**
- `helper` - {Object} helper instance
- `usage` - {String} print usage when show help.
- `yargs` - {Object} for advanced custom usage
- `options` - {Object} object declaring the options the command accepts, @see [docs](http://yargs.js.org/docs/#methods-optionskey-opt) for more detail.

```js
this.options = {
  baseDir: {
    alias: 'b',
    demandOption: true,
    description: 'the target directory',
    coerce: str => path.resolve(prcess.cwd(), str),
  },
  depth: {
    description: 'level to clone',
    type: 'number',
    default: 1,
  },
  size: {
    description: 'choose a size',
    choices: ['xs', 's', 'm', 'l', 'xl']
  },
};
```

### Helper

- `forkNode(modulePath, args, opt)`
- `npmInstall(npmCli, name, cwd)`

**Extend:**

```js
// index.js
const Command = require('common-bin');
const helper = require('./helper');
class MainCommand extends Command {
  constructor() {
    super();
    this.name = pkg.name;

    // load sub command
    this.loadCommand(__dirname, 'command');

    // custom helper
    Object.assign(this.helper, helper);
  }
}
```

## Advanced Usage

### Single Command

Just need to provide `options` and `run()`.

```js
const Command = require('common-bin');
const pkg = require('./package.json');
class MainCommand extends Command {
  constructor() {
    super();
    this.name = pkg.name;
    this.options = {
      baseDir: {
        description: 'target directory',
      },
    };
  }

  * run(context) {
    console.log('run default command at %s', context.argv.baseDir);
  }
}
```

### Sub Command

Also support sub command such as `my-git remote add <name> <url> --tags`.

```js
// test/fixtures/my-git/command/remote.js
class RemoteCommand extends Command {
  constructor() {
    super();
    this.name = 'remote';
    this.description = 'Manage set of tracked repositories';
    // load sub command for directory
    this.loadCommand(path.join(__dirname, 'remote'));
  }

  * run({ argv }) {
    console.log('run remote command with %j', argv._);
  }
}

// test/fixtures/my-git/command/remote/add.js
class AddCommand extends Command {
  constructor() {
    super();
    this.name = 'add <name> <url>';
    this.description = 'Adds a remote named <name> for the repository at <url>';

    this.options = {
      tags: {
        type: 'boolean',
        default: false,
        description: 'imports every tag from the remote repository',
      },
    };
  }

  * run({ argv }) {
    console.log('git remote add %s to %s with tags=%s', argv.name, argv.url, argv.tags);
  }
}
```

see [remote.js](test/fixtures/my-git/command/remote.js) for more detail.


### Async Support

```js
class SleepCommand extends Command {
  constructor() {
    super();
    this.name = 'sleep';
    this.description = 'sleep showcase';
  }

  async run() {
    await sleep('1s');
    console.log('sleep 1s');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

see [async-bin](test/fixtures/async-bin) for more detail.


## Migrating from v1 to v2

### bin

- `run` method is not longer exist.

```js
// 1.x
const run = require('common-bin').run;
run(require('../lib/my_program'));

// 2.x
// require a main Command
const Command = require('..');
new Command().start();
```

### Program

- `Program` is just a `Command` sub class, you can call it `Main Command` now.
- `addCommand()` don't need to pass command name as first argument anymore, it should be a property of `Command` itself.
- Recommand to use `loadCommand(...path)` to load the whole command directory.

```js
// 1.x
this.addCommand('test', path.join(__dirname, 'test_command.js'));

// 2.x
const Command = require('common-bin');
const pkg = require('./package.json');
class MainCommand extends Command {
  constructor() {
    super();
    this.name = pkg.name;

    this.addCommand(path.join(__dirname, 'test_command.js'));
    // or load the entire directory
    this.loadCommand(__dirname, 'command');
  });
```

### Command

- `help()` is not use anymore.
- should provide `name`, `description`, `options`.
- `* run()` arguments had change to object, recommand to use destructuring style - `{ cwd, argv, rawArgv }`
  - `argv` is an object parse by `yargs`, **not `args`.**
  - `rawArgv` is equivalent to old `args`

```js
// 1.x
class TestCommand extends Command {
  * run(cwd, args) {
    console.log('run mocha test at %s with %j', cwd, args);
  }
}

// 2.x
class TestCommand extends Command {
  constructor() {
    super();
    this.name = 'test';
    this.description = 'unit test';
    // my-bin test --require=co-mocha
    this.options = {
      require: {
        description: 'require module name',
      },
    };
  }

  * run({ cwd, argv, rawArgv }) {
    console.log('run mocha test at %s with %j', cwd, argv);
  }
}
```

### helper

- `getIronNodeBin` is remove.
- `child.kill` now support signal.

## License

[MIT](LICENSE)
