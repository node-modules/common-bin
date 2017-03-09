'use strict';

const Command = require('../../..');
const path = require('path');
const pkg = require('./package.json');

class MainCommand extends Command {
  constructor() {
    super();
    this.name = pkg.name;
    this.usage = `Usage: ${this.name} <command> [options]`;

    // load directory
    this.loadCommand(__dirname, 'command');

    // load special file
    this.addCommand(path.join(__dirname, 'lib/test_command.js'));
    this.addCommand(path.join(__dirname, 'lib/cov_command.js'));

    // alias, cov -> test at win
    if (process.env.platform === 'win32') {
      this.aliasMapping.set('cov', 'test');
    }
  }
}

module.exports = exports = MainCommand;
exports.StartCommand = require('./command/start');
