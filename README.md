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

Abstraction bin tool wrap [yarg](http://yargs.js.org/)

---

## Install

```bash
$ npm i common-bin --save-dev
```

## Build a bin tool for your team

You maybe need a custom xxx-bin to implement more custom features.

Now you can implement a [Command](lib/command.js) sub class to do that.

### Example: Add `test` for unittest runner

This example will show you how to add a new `TestCommand` to create a new `my-bin` tool.

- Full demo: [my-bin](test/fixtures/my-bin)

#### [Program](test/fixtures/my-bin/lib/program.js)

`Program` extend `Command`, and use as your bin start point.

You can use `this.yargs` to custom yargs config, see http://yargs.js.org/docs for more detail.

```js
const Command = require('common-bin');
const pkg = require('../package.json';

class Program extends Command {
  constructor() {
    super();
    this.binName = pkg.name;
    this.version = pkg.version;

    // load your command file
    this.loadCommand(path.join(__dirname, 'test_command'));

    // or load entire directory
    // this.loadCommand(path.join(__dirname, 'command'));

    // so you can use `my-bin -V`
    this.yargs.alias('V', 'version');
  }
}

module.exports = Program;
```

#### [TestCommand](test/fixtures/my-bin/lib/test_command.js)

```js
const Command = require('common-bin');

class TestCommand extends Command {
  constructor() {
    super();
    this.name = 'test';
    this.description = 'unit test';
    // see http://yargs.js.org/docs/#methods-optionskey-opt
    this.options = {
      require: {
        description: 'require module name',
      },
    };
  }

  * run({ cwd, argv, rawArgv }) {
    console.log('run mocha test at %s with %s', cwd, argv.require);
  }
}

module.exports = TestCommand;
```

#### [my-bin.js](test/fixtures/my-bin/bin/my-bin.js)

```js
#!/usr/bin/env node

'use strict';

const Program = require('../lib/program');

new Program().exec();
```

#### Run result

```bash
$ my-bin test --require=co-mocha

run mocha test at /foo/bar with co-mocha
```

## Advanced Usage

### sub command

Also support sub command such as `my-bin init controller --name=home`.

```js
// init.js
class InitCommand extends Command {
  constructor() {
    super();
    this.name = 'init';
    this.description = 'sub command showcase';

    // load sub command
    this.options = () => this.loadCommand(path.join(__dirname, 'sub'));
  }
}

// sub/controller.js
class ControllerCommand extends Command {
  constructor() {
    super();
    this.name = 'controller';
    this.description = 'sub controller';
    this.options = {
      name: {
        description: 'controller name',
      },
    };
  }

  * run({ argv }) {
    console.log('create controller %s', argv.name);
  }
}
```

see [sub.js](test/fixtures/my-bin/lib/command/sub.js) for more detail.

## Migrating from v1 to v2

### bin

- `run` method is not longer exist.

```js
// 1.x
const run = require('common-bin').run;
run(require('../lib/my_program'));

// 2.x
const Program = require('common-bin');
new Program().exec();
```

### Program

- `Program` is just a `Command` sub class.
- use `loadCommand()` to replace `addCommand`.
- command name is not need to provide as first argument, it should be a property of `Command` itself.

```js
// 1.x
this.addCommand('test', path.join(__dirname, 'test_command.js'));

// 2.x
this.loadCommand(path.join(__dirname, 'test_command.js'), opts);
// or load the entire directory
this.loadCommand(path.join(__dirname, 'command'));
```

### Command

- `help()` is not use anymore.
- should provide `name`, `description`, `options`.
- `run()` arguments had change to object, recommand to use destructuring style - `{ cwd, argv, rawArgv }`
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
