'use strict';

const Command = require('../../../..');

class TestCommand extends Command {

  async run({ cwd }) {
    console.log('run test command at %s', cwd);
  }

  get description() { return 'test app'; }
}

module.exports = TestCommand;
