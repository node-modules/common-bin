'use strict';

const Command = require('../../../../..');

class NoCommand extends Command {
  constructor() {
    super();
    this.name = 'not-register';
    this.description = 'this will not register';
  }

  * run({ argv }) {
    console.log('run command %s with %j', this.name, argv);
  }
}

module.exports = NoCommand;
