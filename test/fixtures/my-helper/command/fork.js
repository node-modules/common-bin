'use strict';

const Command = require('../../../..');
const path = require('path');

class ForkCommand extends Command {
  constructor(argv) {
    super(argv);
    this.yargs.options({
      target: {
        description: 'fork script file',
      },
    });
  }

  * run({ argv, rawArgv }) {
    yield this.helper.forkNode(path.join(__dirname, '../scripts', argv.target), rawArgv.concat('--from=test'));
  }

  get description() {
    return 'fork node process';
  }
}

module.exports = ForkCommand;
