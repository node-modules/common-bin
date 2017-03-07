'use strict';

const Command = require('../..');

class RemoveCommand extends Command {
  constructor() {
    super();
    this.name = 'remove <name>';
    this.aliases = 'rm';
    this.description = 'Remove the remote named <name>';
  }

  * run({ argv }) {
    console.log('git remote remove %s', argv.name);
  }
}

module.exports = RemoveCommand;
