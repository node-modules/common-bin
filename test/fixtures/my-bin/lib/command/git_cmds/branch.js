'use strict';

const Command = require('../../../../../..').Command;

class BranchCommand extends Command {
  constructor() {
    super();
    this.name = 'branch';
    this.description = 'add a controller/service';
    this.options = {
      xxx: {
        description: 'code style',
        choices: [ 'class', 'exports' ],
        default: 'class',
      },
    };
  }

  * run({ argv }) {
    console.log('run %s with %j', this.name, argv);
  }
}

module.exports = BranchCommand;
