'use strict';

const Command = require('../../../..');
const path = require('path');

class ForkCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.options = {
      target: {
        description: 'fork script file',
      },
    };
  }

  * run({ argv, rawArgv }) {
    const task = this.helper.forkNode(path.join(__dirname, '../scripts', argv.target), rawArgv.concat('--from=test'));
    console.log('task proc: %s', !!task.proc);
    yield task;
  }

  get description() {
    return 'fork node process';
  }
}

module.exports = ForkCommand;
