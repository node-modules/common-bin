'use strict';

const Command = require('../../..');

class Program extends Command {
  constructor(argv) {
    super(argv);
    this.yargs.options({
      baseDir: {
        description: 'target directory',
      },
    });
  }

  run(context) {
    console.log('run default command at %s', context.argv.baseDir);
    this.showHelp();
  }
}

module.exports = Program;
