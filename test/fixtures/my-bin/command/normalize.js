'use strict';

const Command = require('../../../..');
class NormalizeCommand extends Command {
  normalizeContext(context) {
    context = super.normalizeContext(context);
    context.execArgv = [ '--inspect' ];
    return context;
  }

  * run({ execArgv }) {
    console.log('execArgv: %s', execArgv[0]);
  }

  get description() {
    return 'normalize context';
  }
}

module.exports = NormalizeCommand;
