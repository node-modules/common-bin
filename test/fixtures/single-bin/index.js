'use strict';

const Command = require('../../..');

class MainCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.options = {
      baseDir: {
        description: 'target directory',
      },
    };
  }

  run(context) {
    console.log('run default command at %s', context.argv.baseDir);
    console.log('env: %s', JSON.stringify(context.env, null, 2));
    this.showHelp();
  }
}

module.exports = MainCommand;
