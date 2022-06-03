'use strict';

const path = require('path');
const Command = require('../../..');

class MainCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.yargs.usage('Usage: async-bin <command> [options]');

    // load directory
    this.load(path.join(__dirname, 'command'));
  }

  async run({ argv }) {
    console.log('run async command with %s', argv.name);
    await this.helper.forkNode(path.join(__dirname, './scripts/echo_script'));
    await this.callFn();
  }

  async callFn() {
    const empty = await this.helper.callFn('empty');
    const async = await this.helper.callFn(async () => Promise.resolve('async'));
    const promise = await this.helper.callFn(() => Promise.resolve('promise'));
    console.log('%s, %s, %s', empty, async, promise);
  }
}

module.exports = MainCommand;
