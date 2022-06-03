'use strict';

const Command = require('../../../..');

class ErrorCommand extends Command {
  async run() {
    await this.helper.callFn(function* () { return 'generator'; });
  }
}

module.exports = ErrorCommand;
