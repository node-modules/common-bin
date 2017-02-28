'use strict';

const Command = require('../../../../..').Command;

class DebugCommand extends Command {
  constructor(opts) {
    super(opts);
    this.name = 'debug';
    this.description = 'debug app';
  }

  * run({ cwd }) {
    console.log('run %s command at %s', this.name, cwd);
  }
}

module.exports = DebugCommand;
