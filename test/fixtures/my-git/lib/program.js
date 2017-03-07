'use strict';

const Command = require('../../../..');
const pkg = require('../package.json');

class Program extends Command {
  constructor() {
    super();
    this.name = pkg.name;
    this.version = pkg.version;
    this.usage = `Usage: ${this.name} <command> [options]`;

    // load sub command
    this.loadCommand(__dirname, 'command');
  }
}

module.exports = Program;
