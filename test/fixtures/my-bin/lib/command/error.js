'use strict';

const Command = require('../../../../..').Command;

class ErrorCommand extends Command {
  constructor(opts) {
    super(opts);
    this.name = 'error';
    this.description = 'throw error';
  }

  * run() {
    throw new Error(`something wrong with ${this.name}-command`);
  }
}

module.exports = ErrorCommand;
