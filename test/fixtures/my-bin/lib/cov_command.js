'use strict';

const Command = require('../../../..');

class CovCommand extends Command {

  * run({ cwd }) {
    console.log('run cov command at %s', cwd);
  }

  get description() { return 'cov app'; }
}

module.exports = CovCommand;
