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
  }
}

module.exports = Program;
