'use strict';

const Command = require('../../../..');

class DefaultCommand extends Command {
  constructor() {
    super();
    // default command showcase
    this.name = [ 'test', '*' ];
    this.description = 'the only one default command';
    this.options = {
      baseDir: {
        description: 'target dir',
      },
    };
  }

  * run({ argv }) {
    console.log('run command with %s', argv.baseDir);
  }
}

module.exports = DefaultCommand;
