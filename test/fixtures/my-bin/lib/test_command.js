'use strict';

const Command = require('../../../..');

class TestCommand extends Command {
  constructor() {
    super();
    this.name = 'test';
    this.aliases = undefined;
    this.description = 'test app';
  }

  * run({ cwd }) {
    console.log('run test command at %s', cwd);
  }
}

module.exports = TestCommand;
