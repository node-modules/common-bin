'use strict';

const Command = require('../../../../..').Command;

class InitCommand extends Command {
  constructor(opts) {
    super(opts);
    this.name = 'init';
    this.description = 'init app';
  }

  * run({ cwd }) {
    console.log('run %s command at %s', this.name, cwd);
  }
}

module.exports = InitCommand;
