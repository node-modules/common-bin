'use strict';

const Command = require('../../../../..').Command;
const path = require('path');

class RemoteCommand extends Command {
  constructor() {
    super();
    this.name = 'remote';
    this.description = 'Manage set of tracked repositories';

    this.loadCommand(path.join(__dirname, 'remote'));
  }

  * run({ argv }) {
    console.log('run remote command with %j', argv._);
  }
}

module.exports = RemoteCommand;
