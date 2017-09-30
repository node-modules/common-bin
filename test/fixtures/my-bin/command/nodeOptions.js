'use strict';

const Command = require('../../../..');
const path = require('path');

class NodeOptionsCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.parserOptions = {
      execArgv: true,
    };
  }


  * run({ execArgv }) {
    console.log('execArgv: %s', execArgv);
    yield this.helper.forkNode(path.join(__dirname, 'start-cluster'), [], { execArgv });
  }

  get description() {
    return 'node options';
  }
}

module.exports = NodeOptionsCommand;
