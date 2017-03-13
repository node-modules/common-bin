'use strict';

const Command = require('../../../..');

class CloneCommand extends Command {
  constructor() {
    super();
    this.yargs.usage('clone <repository> [directory]');

    this.yargs.options({
      depth: {
        type: 'number',
        description: 'Create a shallow clone with a history truncated to the specified number of commits',
      },
    });
  }

  * run({ argv }) {
    console.log(argv);
    console.log('git clone %s to %s with depth %d', argv.repository, argv.directory, argv.depth);
  }

  get description() {
    return 'Clone a repository into a new directory';
  }
}

module.exports = CloneCommand;
