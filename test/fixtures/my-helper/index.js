'use strict';

const BaseCommand = require('../../..');
const pkg = require('./package.json');
const helper = require('./lib/helper');

class Command extends BaseCommand {
  start() {
    this.name = pkg.name;
    this.usage = `Usage: ${this.name} <command> [options]`;

    // load sub command
    this.loadCommand(__dirname, 'command');

    // custom helper
    Object.assign(this.helper, helper);

    super.start();
  }
}

module.exports = Command;
