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


  * run(context) {
    context.execArgvObj = { require: 'abc' };
    console.log('execArgv: %j', context.execArgv);

    context.execArgvObj = { require: [ 'abc', '123' ] };
    console.log('execArgv: %j', context.execArgv);

    context.execArgvObj = { require: [ './a.js', '/b.js' ] };
    console.log('execArgv: %j', context.execArgv);
  }

  get description() {
    return 'custom context';
  }
}

module.exports = ContextCommand;
