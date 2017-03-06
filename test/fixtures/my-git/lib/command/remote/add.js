'use strict';

const Command = require('../../../../../..').Command;

class AddCommand extends Command {
  constructor() {
    super();
    this.name = 'add <name> <url>';
    this.description = 'Adds a remote named <name> for the repository at <url>';

    this.options = {
      tags: {
        type: 'boolean',
        default: false,
        description: 'imports every tag from the remote repository',
      },
    };
  }

  * run({ argv }) {
    console.log('git remote add %s to %s with tags=%s', argv.name, argv.url, argv.tags);
  }
}

module.exports = AddCommand;
