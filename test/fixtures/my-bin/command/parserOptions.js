'use strict';

const Command = require('../../../..');

class ParserOptionsCommand extends Command {
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


  * run({ argv, execArgv, debugPort }) {
    console.log('argv: %j', argv);
    console.log('execArgv: %s', execArgv);
    console.log('debugPort: %s', debugPort);
  }

  get description() {
    return 'parser options';
  }
}

module.exports = ParserOptionsCommand;
