'use strict';

const Command = require('../../..');

class MainCommand extends Command {
  constructor(argv) {
    super(argv);
    this.yargs.usage('Usage: my-git <command> [options]');

    // load sub command
    this.loadCommand(__dirname, 'command');
  }
}

module.exports = MainCommand;
