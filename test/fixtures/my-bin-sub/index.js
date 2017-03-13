'use strict';

const Command = require('../my-bin');

class MainCommand extends Command {
  constructor() {
    super();
    this.yargs.usage('Usage: my-bin-sub <command> [options]');

    // load directory
    this.loadCommand(__dirname, 'command');
  }
}

module.exports = MainCommand;
