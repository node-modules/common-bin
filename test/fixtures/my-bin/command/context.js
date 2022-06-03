'use strict';

const Command = require('../../../..');

class ContextCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.options = {
      baseDir: {
        description: 'target directory',
        alias: 'b',
      },
    };
  }


  async run({ argv, execArgv }) {
    console.log('argv: %j', argv);
    console.log('execArgv: %s', execArgv);
  }

  get description() {
    return 'custom context';
  }
}

module.exports = ContextCommand;
