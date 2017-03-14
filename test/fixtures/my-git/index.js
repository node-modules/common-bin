'use strict';

const path = require('path');
const Command = require('../../..');

class MainCommand extends Command {
  constructor(argv) {
    super(argv);
    this.yargs.usage('Usage: my-git <command> [options]');

    // load sub command
    this.load(path.join(__dirname, 'command'));
  }
}

module.exports = MainCommand;
