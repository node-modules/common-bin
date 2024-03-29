'use strict';

const Command = require('../../../..');

class ErrorCommand extends Command {

  async run() {
    throw new Error('something wrong');
  }

  get description() { return 'throw error'; }
}

module.exports = ErrorCommand;
