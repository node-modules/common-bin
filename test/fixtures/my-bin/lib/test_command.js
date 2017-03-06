'use strict';

const Command = require('../../../..').Command;

class TestCommand extends Command {
  constructor() {
    super();
    this.name = 'test';
    this.description = 'test app';
  }

  * run({ cwd }) {
    console.log('run test command at %s', cwd);
  }
}

module.exports = TestCommand;
