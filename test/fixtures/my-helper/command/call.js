'use strict';

const Command = require('../../../..');

class CallCommand extends Command {

  async run() {
    const empty = await this.helper.callFn('empty');
    const promise = await this.helper.callFn(() => Promise.resolve('promise'));
    console.log('%s, %s', empty, promise);
  }

  get description() {
    return 'call fn';
  }
}

module.exports = CallCommand;
