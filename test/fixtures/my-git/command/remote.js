'use strict';

const Command = require('../../../..');

class RemoteCommand extends Command {
  constructor() {
    super();
    this.yargs.usage('Usage: my-git remote <add/remove>');
    this.loadCommand(__dirname, 'remote');
  }

  * run({ argv }) {
    console.log('run remote command with %j', argv._);
  }

  get description() {
    return 'Manage set of tracked repositories';
  }
}

module.exports = RemoteCommand;
