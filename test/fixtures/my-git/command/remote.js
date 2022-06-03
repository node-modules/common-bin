'use strict';

const path = require('path');
const Command = require('../../../..');

class RemoteCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.yargs.usage('Usage: my-git remote <add/remove>');
    this.load(path.join(__dirname, 'remote'));
    this.alias('rm', 'remove');
  }

  async run({ argv }) {
    console.log('run remote command with %j', argv._);
  }

  get description() {
    return 'Manage set of tracked repositories';
  }
}

module.exports = RemoteCommand;
