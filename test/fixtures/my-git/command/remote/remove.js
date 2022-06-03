'use strict';

const Command = require('../../../../..');

class RemoveCommand extends Command {

  async run({ argv }) {
    console.log('git remote remove %s', argv._[0]);
  }

  get description() {
    return 'Remove the remote named <name>';
  }
}

module.exports = RemoveCommand;
