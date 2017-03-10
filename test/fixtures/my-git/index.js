'use strict';

const Command = require('../../..');
const pkg = require('./package.json');

class MainCommand extends Command {
  constructor() {
    super();
    this.name = pkg.name;
    this.usage = `Usage: ${this.name} <command> [options]`;

    // load sub command
    this.loadCommand(__dirname, 'command');
  }
}

module.exports = MainCommand;
