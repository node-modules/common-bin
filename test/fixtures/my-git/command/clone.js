'use strict';

const Command = require('../../../..');

class CloneCommand extends Command {
  constructor() {
    super();
    this.name = 'clone <repository> [directory]';
    this.description = 'Clone a repository into a new directory';

    this.options = {
      depth: {
        type: 'number',
        description: 'Create a shallow clone with a history truncated to the specified number of commits',
      },
    };
  }

  * run({ argv }) {
    console.log('git clone %s to %s with depth %d', argv.repository, argv.directory, argv.depth);
  }
}

module.exports = CloneCommand;
