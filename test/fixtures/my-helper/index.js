'use strict';

const Command = require('../../..');
const pkg = require('./package.json');
const helper = require('./lib/helper');

class MainCommand extends Command {
  constructor() {
    super();
    this.name = pkg.name;
    this.usage = `Usage: ${this.name} <command> [options]`;

    // load sub command
    this.loadCommand(__dirname, 'command');

    // custom helper
    Object.assign(this.helper, helper);
  }
}

module.exports = MainCommand;