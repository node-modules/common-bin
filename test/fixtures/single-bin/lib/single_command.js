'use strict';

const BaseCommand = require('../../../..').Command;

class Command extends BaseCommand {
  constructor(opts) {
    super(opts);
    // default command showcase
    this.name = '*';
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

module.exports = Command;
