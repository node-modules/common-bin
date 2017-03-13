'use strict';

const Command = require('../../../..');

class CallCommand extends Command {

  * run() {
    const empty = yield this.helper.callFn('empty');
    const promise = yield this.helper.callFn(() => Promise.resolve('promise'));
    const generator = yield this.helper.callFn(function* () { return 'generator'; });
    console.log('%s, %s, %s', empty, promise, generator);
  }

  get description() {
    return 'call fn';
  }
}

module.exports = CallCommand;
