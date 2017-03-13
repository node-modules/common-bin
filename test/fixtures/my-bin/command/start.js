'use strict';

const Command = require('../../../..');
const path = require('path');

class StartCommand extends Command {
  constructor() {
    super();
    this.aliases = [ 'begin' ];
    this.yargs.options({
      port: {
        description: 'port of http server',
        type: 'number',
        default: 7001,
      },
    });
  }

  * run({ cwd, argv }) {
    console.log('run start command at %s with port %j', cwd, argv.port);
    yield this.helper.forkNode(path.join(__dirname, 'start-cluster'), [ '--port', argv.port ]);
  }

  get description() {
    return 'start app';
  }
}

module.exports = StartCommand;
