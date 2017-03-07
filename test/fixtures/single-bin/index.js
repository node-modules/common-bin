'use strict';

const Command = require('../../..');
const pkg = require('./package.json');

class Program extends Command {
  start() {
    this.name = pkg.name;

    this.options = {
      baseDir: {
        description: 'target directory',
      },
    };

    super.start();
  }

  run(context) {
    console.log('run default command at %s', context.argv.baseDir);
    this.showHelp();
  }
}

module.exports = Program;
