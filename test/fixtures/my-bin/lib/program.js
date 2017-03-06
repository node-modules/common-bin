'use strict';

const path = require('path');
const BaseProgram = require('../../../..').Program;
const pkg = require('../package.json');

class Program extends BaseProgram {
  constructor() {
    super();
    this.name = pkg.name;
    this.version = pkg.version;
    this.usage = `Usage: ${this.name} <command> [options]`;

    // load directory
    this.loadCommand(path.join(__dirname, 'command'));

    // load special file
    this.loadCommand(path.join(__dirname, 'test_command.js'));
    this.loadCommand(path.join(__dirname, 'cov_command.js'));

    // TODO: override test, like @ali/egg-init

    // alias, cov -> test at win
    if (process.env.platform === 'win32') {
      this.aliasMapping.set('cov', 'test');
    }
  }
}

module.exports = Program;
