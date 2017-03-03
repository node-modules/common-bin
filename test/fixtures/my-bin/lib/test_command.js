'use strict';

const Command = require('../../../..').Command;
const path = require('path');

class TestCommand extends Command {
  constructor(opts) {
    super(opts);
    this.name = 'test';
    this.description = 'unit test';
    this.options = {
      require: {
        description: 'require module name',
      },
    };
  }

  * run({ cwd, argv, rawArgv }) {
    console.log('run mocha test at %s with %s', cwd, argv.require);
    console.log('rawArgv: %j', rawArgv);
    yield this.helper.forkNode(path.join(__dirname, './scripts/test_script'));
  }
}

module.exports = TestCommand;
