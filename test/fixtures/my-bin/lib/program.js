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

    // default command showcase
    this.loadCommand(path.join(__dirname, 'command'));
  }
}

module.exports = Program;
