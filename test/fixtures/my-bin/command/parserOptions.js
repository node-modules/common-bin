'use strict';

const Command = require('../../../..');

class ContextCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.parserOptions = {
      execArgv: true,
      removeAlias: true,
      removeCamelCase: true,
    };

    this.options = {
      baseDir: {
        description: 'target directory',
        alias: 'b',
      },
    };
  }


  async run({ argv, execArgv, debugPort }) {
    console.log('argv: %j', argv);
    console.log('execArgv: %s', execArgv.join(','));
    console.log('debugPort: %s', debugPort);
  }

  get description() {
    return 'custom context';
  }
}

module.exports = ContextCommand;
