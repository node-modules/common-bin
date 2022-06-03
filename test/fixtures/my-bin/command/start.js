'use strict';

const Command = require('../../../..');
const path = require('path');

class StartCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.yargs.options({
      port: {
        description: 'port of http server',
        type: 'number',
        default: 7001,
      },
      env: {
        description: 'run env name, support `test` only',
        type: 'string',
        choices: [ 'test' ],
      },
    });
  }

  async run({ cwd, argv, rawArgv }) {
    console.log('run start command at %s with port %j', cwd, argv.port);
    console.log('rawArgv: %s', rawArgv);
    await this.helper.forkNode(path.join(__dirname, 'start-cluster'), [ '--port', argv.port ]);
  }

  get description() {
    return 'start app';
  }
}

module.exports = StartCommand;
