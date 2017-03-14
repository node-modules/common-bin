'use strict';

const path = require('path');
const Command = require('../../..');
const co = require('co');

class MainCommand extends Command {
  constructor(argv) {
    super(argv);
    this.yargs.usage('Usage: async-bin <command> [options]');

    // load directory
    this.load(path.join(__dirname, 'command'));
  }

  async run({ argv }) {
    console.log('run async command with %s', argv.name);
    await this.helper.forkNode(path.join(__dirname, './scripts/echo_script'));
    await this.callFn();
  }

  callFn() {
    return co(function* () {
      const empty = yield this.helper.callFn('empty');
      const async = yield this.helper.callFn(async () => Promise.resolve('async'));
      const promise = yield this.helper.callFn(() => Promise.resolve('promise'));
      const generator = yield this.helper.callFn(function* () { return 'generator'; });
      console.log('%s, %s, %s, %s', empty, async, promise, generator);
    }.bind(this));
  }
}

module.exports = MainCommand;
