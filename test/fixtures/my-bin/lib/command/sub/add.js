'use strict';

const Command = require('../../../../../..');

class AddCommand extends Command {
  constructor() {
    super();
    this.name = 'add';
    this.description = 'sub command example';
  }

  * run({ cwd }) {
    console.log('run sub %s command at %s', this.name, cwd);
  }
}

module.exports = AddCommand;
