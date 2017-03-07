'use strict';

const Command = require('../../../../..').Command;

class RemoteCommand extends Command {
  constructor() {
    super();
    this.name = 'remote';
    this.description = 'Manage set of tracked repositories';

    this.loadCommand(__dirname, 'remote');
  }

  * run({ argv }) {
    console.log('run remote command with %j', argv._);
  }
}

module.exports = RemoteCommand;
