# common-bin

[![NPM version][npm-image]][npm-url]
[![Node.js CI](https://github.com/node-modules/common-bin/actions/workflows/nodejs.yml/badge.svg)](https://github.com/node-modules/common-bin/actions/workflows/nodejs.yml)
[![Test coverage][codecov-image]][codecov-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/common-bin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/common-bin
[codecov-image]: https://codecov.io/gh/node-modules/common-bin/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/node-modules/common-bin
[snyk-image]: https://snyk.io/test/npm/common-bin/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/common-bin
[download-image]: https://img.shields.io/npm/dm/common-bin.svg?style=flat-square
[download-url]: https://npmjs.org/package/common-bin

Abstraction bin tool wrap [yargs](http://yargs.js.org/), to provide more convenient usage, support async / await style.

---

## Install

```bash
$ npm i common-bin
```

## Build a bin tool for your team

You maybe need a custom xxx-bin to implement more custom features.

Now you can implement a [Command](lib/command.js) sub class to do that.

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

You can use `this.yargs` to custom yargs config, see http://yargs.js.org/docs for more detail.

```js
const Command = require('common-bin');
const pkg = require('./package.json');

class MainCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: my-git <command> [options]';

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
  constructor(rawArgv) {
    super(rawArgv);

    this.options = {
      depth: {
        type: 'number',
        description: 'Create a shallow clone with a history truncated to the specified number of commits',
      },
    };
  }

  async run({ argv }) {
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

- `async start()` - start your program, only use once in your bin file.
- `async run(context)`
  - should implement this to provide command handler, will exec when not found sub command.
  - Support generator / async function / normal function which return promise.
  - `context` is `{ cwd, env, argv, rawArgv }`
    - `cwd` - `process.cwd()`
    - `env` - clone env object from `process.env`
    - `argv` - argv parse result by yargs, `{ _: [ 'start' ], '$0': '/usr/local/bin/common-bin', baseDir: 'simple'}`
    - `rawArgv` - the raw argv, `[ "--baseDir=simple" ]`
- `load(fullPath)` - register the entire directory to commands
- `add(name, target)` - register special command with command name, `target` could be full path of file or Class.
- `alias(alias, name)` - register a command with an existing command
- `showHelp()` - print usage message to console.
- `options=` - a setter, shortcut for `yargs.options`
- `usage=` - a setter, shortcut for `yargs.usage`

**Properties:**

- `description` - {String} a getter, only show this description when it's a sub command in help console
- `helper` - {Object} helper instance
- `yargs` - {Object} yargs instance for advanced custom usage
- `options` - {Object} a setter, set yargs' options
- `version` - {String} customize version, can be defined as a getter to support lazy load.
- `parserOptions` - {Object} control `context` parse rule.
  - `execArgv` - {Boolean} whether extract `execArgv` to `context.execArgv`
  - `removeAlias` - {Boolean} whether remove alias key from `argv`
  - `removeCamelCase` - {Boolean} whether remove camel case key from `argv`

You can define options by set `this.options`

```js
this.options = {
  baseDir: {
    alias: 'b',
    demandOption: true,
    description: 'the target directory',
    coerce: str => path.resolve(process.cwd(), str),
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

You can define version by define `this.version` getter:

```js
get version() {
  return 'v1.0.0';
}
```

### Helper

- `async forkNode(modulePath, args, opt)` - fork child process, wrap with promise and gracefull exit
- `async spawn(cmd, args, opt)` - spawn a new process, wrap with promise and gracefull exit
- `async npmInstall(npmCli, name, cwd)` - install node modules, wrap with promise
- `async callFn(fn, args, thisArg)` - call fn, support gernerator / async / normal function return promise
- `unparseArgv(argv, opts)` - unparse argv and change it to array style

**Extend Helper**

```js
// index.js
const Command = require('common-bin');
const helper = require('./helper');
class MainCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);

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
  constructor(rawArgv) {
    super(rawArgv);
    this.options = {
      baseDir: {
        description: 'target directory',
      },
    };
  }

  async run(context) {
    console.log('run default command at %s', context.argv.baseDir);
  }
}
```

### Sub Command

Also support sub command such as `my-git remote add <name> <url> --tags`.

```js
// test/fixtures/my-git/command/remote.js
class RemoteCommand extends Command {
  constructor(rawArgv) {
    // DO NOT forgot to pass params to super
    super(rawArgv);
    // load sub command for directory
    this.load(path.join(__dirname, 'remote'));
  }

  async run({ argv }) {
    console.log('run remote command with %j', argv._);
  }

  get description() {
    return 'Manage set of tracked repositories';
  }
}

// test/fixtures/my-git/command/remote/add.js
class AddCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);

    this.options = {
      tags: {
        type: 'boolean',
        default: false,
        description: 'imports every tag from the remote repository',
      },
    };

  }

  async run({ argv }) {
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

### Bash-Completions

```bash
$ # exec below will print usage for auto bash completion
$ my-git completion
$ # exec below will mount auto completion to your bash
$ my-git completion >> ~/.bashrc
```

![Bash-Completions](https://cloud.githubusercontent.com/assets/227713/23980327/0a00e1a0-0a3a-11e7-81be-23b4d54d91ad.gif)


## Migrating from v1 to v3

### bin

- `run` method is not longer exist.

```js
// 1.x
const run = require('common-bin').run;
run(require('../lib/my_program'));

// 3.x
// require a main Command
const Command = require('..');
new Command().start();
```

### Program

- `Program` is just a `Command` sub class, you can call it `Main Command` now.
- `addCommand()` is replace with `add()`.
- Recommand to use `load()` to load the whole command directory.

```js
// 1.x
this.addCommand('test', path.join(__dirname, 'test_command.js'));

// 3.x
const Command = require('common-bin');
const pkg = require('./package.json');

class MainCommand extends Command {
  constructor() {
    super();

    this.add('test', path.join(__dirname, 'test_command.js'));
    // or load the entire directory
    this.load(path.join(__dirname, 'command'));
  }
}
```

### Command

- `help()` is not use anymore.
- should provide `name`, `description`, `options`.
- `async run()` arguments had change to object, recommand to use destructuring style - `{ cwd, env, argv, rawArgv }`
  - `argv` is an object parse by `yargs`, **not `args`.**
  - `rawArgv` is equivalent to old `args`

```js
// 1.x
class TestCommand extends Command {
  * run(cwd, args) {
    console.log('run mocha test at %s with %j', cwd, args);
  }
}

// 3.x
class TestCommand extends Command {
  constructor() {
    super();
    // my-bin test --require=co-mocha
    this.options = {
      require: {
        description: 'require module name',
      },
    };
  }

  async run({ cwd, env, argv, rawArgv }) {
    console.log('run mocha test at %s with %j', cwd, argv);
  }

  get description() {
    return 'unit test';
  }
}
```

### helper

- `getIronNodeBin` is remove.
- `child.kill` now support signal.

## License

[MIT](LICENSE)
<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/227713?v=4" width="100px;"/><br/><sub><b>atian25</b></sub>](https://github.com/atian25)<br/>|[<img src="https://avatars.githubusercontent.com/u/156269?v=4" width="100px;"/><br/><sub><b>fengmk2</b></sub>](https://github.com/fengmk2)<br/>|[<img src="https://avatars.githubusercontent.com/u/360661?v=4" width="100px;"/><br/><sub><b>popomore</b></sub>](https://github.com/popomore)<br/>|[<img src="https://avatars.githubusercontent.com/u/985607?v=4" width="100px;"/><br/><sub><b>dead-horse</b></sub>](https://github.com/dead-horse)<br/>|[<img src="https://avatars.githubusercontent.com/u/5856440?v=4" width="100px;"/><br/><sub><b>whxaxes</b></sub>](https://github.com/whxaxes)<br/>|[<img src="https://avatars.githubusercontent.com/u/9692408?v=4" width="100px;"/><br/><sub><b>DiamondYuan</b></sub>](https://github.com/DiamondYuan)<br/>|
| :---: | :---: | :---: | :---: | :---: | :---: |
[<img src="https://avatars.githubusercontent.com/u/7477670?v=4" width="100px;"/><br/><sub><b>tenpend</b></sub>](https://github.com/tenpend)<br/>|[<img src="https://avatars.githubusercontent.com/u/6399899?v=4" width="100px;"/><br/><sub><b>hacke2</b></sub>](https://github.com/hacke2)<br/>|[<img src="https://avatars.githubusercontent.com/u/11896359?v=4" width="100px;"/><br/><sub><b>liuqipeng417</b></sub>](https://github.com/liuqipeng417)<br/>|[<img src="https://avatars.githubusercontent.com/u/36788851?v=4" width="100px;"/><br/><sub><b>Jarvis2018</b></sub>](https://github.com/Jarvis2018)<br/>

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Sat Jun 04 2022 00:31:29 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->
