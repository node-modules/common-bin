'use strict';

const Command = require('../../../../..');

class DebugCommand extends Command {
  constructor() {
    super();
    this.name = 'debug';
    this.description = 'debug app';
  }

  * run({ cwd }) {
    console.log('run %s command at %s', this.name, cwd);
  }
}

module.exports = DebugCommand;
