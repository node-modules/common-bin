'use strict';

const Command = require('../../../..');

class ContextCommand extends Command {
  get context() {
    const context = super.context;
    context.execArgv = [ '--inspect' ];
    return context;
  }

  * run({ execArgv }) {
    console.log('execArgv: %s', execArgv[0]);
  }

  get description() {
    return 'custom context';
  }
}

module.exports = ContextCommand;
