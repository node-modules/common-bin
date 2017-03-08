'use strict';

const Command = require('../../../..');

class CallCommand extends Command {
  constructor() {
    super();
    this.name = 'call';
    this.description = 'call fn';
  }

  * run() {
    const empty = yield this.helper.callFn('empty');
    const promise = yield this.helper.callFn(() => Promise.resolve('promise'));
    const generator = yield this.helper.callFn(function* () { return 'generator'; });
    console.log('%s, %s, %s', empty, promise, generator);
  }
}

module.exports = CallCommand;
