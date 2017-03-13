'use strict';

const Command = require('../../..');
const helper = require('./lib/helper');

class MainCommand extends Command {
  constructor(argv) {
    super(argv);
    this.yargs.usage('Usage: my-helper <command> [options]');

    // load sub command
    this.loadCommand(__dirname, 'command');

    // custom helper
    Object.assign(this.helper, helper);
  }
}

module.exports = MainCommand;
