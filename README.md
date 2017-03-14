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
- You can use `this.yargs` to custom yargs config, see http://yargs.js.org/docs for more detail.

```js
const Command = require('common-bin');
const pkg = require('./package.json';

class MainCommand extends Command {
  constructor(argv) {
    super(argv);
    this.yargs.usage('Usage: my-git <command> [options]');

    // load entire command directory
    this.load(path.join(__dirname, 'command'));

    // or load special command file
    // this.add(path.join(__dirname, 'test_command.js'));

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
  constructor(argv) {
    super(argv);

    this.yargs.options({
      depth: {
        type: 'number',
        description: 'Create a shallow clone with a history truncated to the specified number of commits',
      },
    });
  }

  * run({ argv }) {
    console.log('git clone %s to %s with depth %d', argv._[0], argv._[1], argv.depth);
  }

  get description() {
    return 'Clone a repository into a new directory';
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
- `load(fullPath)` - register the entire directory to commands
- `add(name, filePath)` - register special file to command with command name
- `alias(alias, name)` - register a command with an existing command
- `showHelp()` - print usage message to console.

**Properties:**

- `description` - {String} a getter, only show this description when it's a sub command in help console
- `helper` - {Object} helper instance
- `yargs` - {Object} yargs instance for advanced custom usage

You can define options using yargs

```js
this.yargs.options({
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
});
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
  constructor(argv) {
    super(argv);

    // load sub command
    this.load(path.join(__dirname, 'command'));

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
class MainCommand extends Command {
  constructor(argv) {
    super(argv);
    this.yargs.options({
      baseDir: {
        description: 'target directory',
      },
    });
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
  constructor(argv) {
    super(argv);
    // load sub command for directory
    this.load(path.join(__dirname, 'remote'));
  }

  * run({ argv }) {
    console.log('run remote command with %j', argv._);
  }

  get description() {
    return 'Manage set of tracked repositories';
  }
}

// test/fixtures/my-git/command/remote/add.js
class AddCommand extends Command {
  constructor(argv) {
    super(argv);

    this.yargs.options({
      tags: {
        type: 'boolean',
        default: false,
        description: 'imports every tag from the remote repository',
      },
    });

  }

  * run({ argv }) {
    console.log('git remote add %s to %s with tags=%s', argv.name, argv.url, argv.tags);
  }

  get description() {
    return 'Adds a remote named <name> for the repository at <url>';
  }
}
```

see [remote.js](test/fixtures/my-git/command/remote.js) for more detail.


### Async Support

```js
class SleepCommand extends Command {

  async run() {
    await sleep('1s');
    console.log('sleep 1s');
  }

  get description() {
    return 'sleep showcase';
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

see [async-bin](test/fixtures/async-bin) for more detail.

## License

[MIT](LICENSE)
