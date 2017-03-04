'use strict';

const Command = require('../../../../..');

class InitCommand extends Command {
  constructor() {
    super();
    this.name = 'init';
    this.description = 'init app';
  }

  * run({ cwd }) {
    console.log('run %s command at %s', this.name, cwd);
  }
}

module.exports = InitCommand;
