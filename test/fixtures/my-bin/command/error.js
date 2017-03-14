'use strict';

const Command = require('../../../..');

class ErrorCommand extends Command {

  * run() {
    throw new Error('something wrong');
  }

  get description() { return 'throw error'; }
}

module.exports = ErrorCommand;
