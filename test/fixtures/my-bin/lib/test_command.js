'use strict';

const path = require('path');
const Command = require('../../../..').Command;

class TestCommand extends Command {
  * run(cwd, args) {
    console.log('run mocha test at %s with %j', cwd, args);
    yield this.helper.forkNode(path.join(__dirname, 'version.js'));
    yield this.helper.getIronNodeBin('cnpm', cwd);
  }

  help() {
    return 'unit test';
  }
}

module.exports = TestCommand;
