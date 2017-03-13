'use strict';

const Command = require('../../../../..');

class NoCommand extends Command {

  * run({ argv }) {
    console.log('run command %s with %j', this.name, argv);
  }

  get description() {
    return 'this will not register';
  }
}

module.exports = NoCommand;
