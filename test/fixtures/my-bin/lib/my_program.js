'use strict';

const path = require('path');
const Program = require('../../../..').Program;

class MyProgram extends Program {
  constructor() {
    super();
    this.version = require('../package.json').version;

    this.addCommand('test', path.join(__dirname, 'test_command.js'));
  }
}

module.exports = MyProgram;
