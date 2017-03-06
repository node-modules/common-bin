'use strict';

const Command = require('../../../..').Command;

class CovCommand extends Command {
  constructor() {
    super();
    this.name = 'cov';
    this.description = 'cov app';
  }

  * run({ cwd }) {
    console.log('run cov command at %s', cwd);
  }
}

module.exports = CovCommand;
