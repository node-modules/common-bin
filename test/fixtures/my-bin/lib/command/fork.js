'use strict';

const Command = require('../../../../..').Command;
const path = require('path');

class ForkCommand extends Command {
  constructor(opts) {
    super(opts);
    this.name = 'fork';
    this.description = 'fork node process';
  }

  * run({ argv, rawArgv }) {
    yield this.helper.forkNode(path.join(__dirname, '../scripts', argv.target), rawArgv.concat('--from=test'));
  }
}

module.exports = ForkCommand;
