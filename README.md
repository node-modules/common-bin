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

Abstraction bin tool.

---

## Install

```bash
$ npm i common-bin --save-dev
```

## Build a bin tool for your team

You maybe need a custom xxx-bin to implement more custom features.

Now you can implement a [Program](lib/program.js) sub class,
and [Command](lib/command.js) sub class to do that.

### Example: Add `test` for unittest runner

This example will show you how to add a new `TestCommand` and `MyProgram`
to create a new `my-bin` tool.

- Full demo: [my-bin](test/fixtures/my-bin)

#### [MyProgram](test/fixtures/my-bin/lib/my_program.js)

```js
const Program = require('common-bin').Program;

class MyProgram extends Program {
  constructor() {
    super();
    this.version = require('../package.json').version;

    this.addCommand('test', path.join(__dirname, 'test_command.js'));
  }
}

module.exports = MyProgram;
```

#### [TestCommand](test/fixtures/my-bin/lib/test_command.js)

```js
const Command = require('common-bin').Command;

class TestCommand extends Command {
  * run(cwd, args) {
    console.log('run mocha test at %s with %j', cwd, args);
  }

  help() {
    return 'unit test';
  }
}

module.exports = TestCommand;
```

#### [my-bin.js](test/fixtures/my-bin/bin/my-bin.js)

```js
#!/usr/bin/env node

'use strict';

const run = require('common-bin').run;

run(require('../lib/my_program'));
```

#### Run result

```bash
$ my-bin test

run mocha test at /foo/bar with []
```

## License

[MIT](LICENSE)
