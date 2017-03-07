'use strict';

const Command = require('../../../../..');

class ErrorCommand extends Command {
  constructor() {
    super();
    this.name = 'error';
    this.description = 'throw error';
  }

  * run() {
    throw new Error(`something wrong with ${this.name}-command`);
  }
}

module.exports = ErrorCommand;
