'use strict';

const BaseCommand = require('../../..');
const pkg = require('./package.json');

class Command extends BaseCommand {
  start() {
    this.name = pkg.name;
    this.usage = `Usage: ${this.name} <command> [options]`;

    // load sub command
    this.loadCommand(__dirname, 'command');

    super.start();
  }
}

module.exports = Command;
