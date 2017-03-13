'use strict';

const Command = require('../../../..');

class RemoteCommand extends Command {
  constructor(argv) {
    super(argv);
    this.yargs.usage('Usage: my-git remote <add/remove>');
    this.loadCommand(__dirname, 'remote');
    this.aliasCommand('rm', 'remove');
  }

  * run({ argv }) {
    console.log('run remote command with %j', argv._);
  }

  get description() {
    return 'Manage set of tracked repositories';
  }
}

module.exports = RemoteCommand;
