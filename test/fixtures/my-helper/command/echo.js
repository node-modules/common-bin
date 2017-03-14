'use strict';

const Command = require('../../../..');

class EchoCommand extends Command {

  * run({ argv }) {
    console.log(this.helper.echo(argv._[0]));
  }

  get description() {
    return 'say hi';
  }
}

module.exports = EchoCommand;
