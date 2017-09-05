'use strict';

const Command = require('../../../..');

class ContextCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.parserOptions = {
      execArgv: true,
      removeAlias: true,
    };

    this.options = {
      baseDir: {
        description: 'target directory',
        alias: 'b',
      },
    };
  }


  * run({ argv, execArgv, debugPort, debugOptions }) {
    console.log('argv: %j', argv);
    console.log('execArgv: %s', execArgv);
    console.log('debugPort: %s', debugPort);
    console.log('debugOptions: %j', debugOptions);
  }

  get description() {
    return 'custom context';
  }
}

module.exports = ContextCommand;
