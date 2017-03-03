'use strict';

const Command = require('../../../..').Command;

class StartCommand extends Command {
  constructor(opts) {
    super(opts);
    this.name = [ 'start' ];
    this.description = 'start app';
    this.example = [
      [ 'my-bin start --baseDir=../dist', 'run app at dist dir' ],
    ];
    this.options = {
      baseDir: {
        description: 'target dir',
      },
    };
  }

  * run({ cwd, argv, rawArgv }) {
    console.log('run start command at %s with %s', cwd, argv.baseDir);
    console.log('rawArgv: %j', rawArgv);
  }
}

module.exports = StartCommand;