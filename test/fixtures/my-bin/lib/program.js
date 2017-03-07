'use strict';

const BaseProgram = require('../../../..').Program;
const pkg = require('../package.json');

class Program extends BaseProgram {
  constructor() {
    super();
    this.name = pkg.name;
    this.version = pkg.version;
    this.usage = `Usage: ${this.name} <command> [options]`;

    // load directory
    this.loadCommand(__dirname, 'command');

    // load special file
    this.addCommand(__dirname, 'test_command.js');
    this.addCommand(__dirname, 'cov_command.js');

    // alias, cov -> test at win
    if (process.env.platform === 'win32') {
      this.aliasMapping.set('cov', 'test');
    }
  }
}

module.exports = Program;
