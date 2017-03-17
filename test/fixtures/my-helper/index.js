'use strict';

const path = require('path');
const Command = require('../../..');
const helper = require('./lib/helper');

class MainCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.yargs.usage('Usage: my-helper <command> [options]');

    // load sub command
    this.load(path.join(__dirname, 'command'));

    // custom helper
    Object.assign(this.helper, helper);
  }
}

module.exports = MainCommand;
