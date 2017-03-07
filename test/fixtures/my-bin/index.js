'use strict';

const BaseCommand = require('../../..');
const pkg = require('./package.json');

class Command extends BaseCommand {
  start() {
    this.name = pkg.name;
    this.usage = `Usage: ${this.name} <command> [options]`;

    // load directory
    this.loadCommand(__dirname, 'command');

    // load special file
    this.addCommand(__dirname, 'lib/test_command.js');
    this.addCommand(__dirname, 'lib/cov_command.js');

    // alias, cov -> test at win
    if (process.env.platform === 'win32') {
      this.aliasMapping.set('cov', 'test');
    }

    super.start();
  }
}

module.exports = Command;
