'use strict';

const Command = require('../../../../..');

class AddCommand extends Command {
  constructor(argv) {
    super(argv);
    this.yargs.usage('Usage: my-git remote add <name> <url>');
    this.yargs.options({
      tags: {
        type: 'boolean',
        default: false,
        description: 'imports every tag from the remote repository',
      },
    });
  }

  * run({ argv }) {
    console.log('git remote add %s to %s with tags=%s', argv._[0], argv._[1], argv.tags);
  }

  get description() {
    return 'Adds a remote named <name> for the repository at <url>';
  }
}

module.exports = AddCommand;
