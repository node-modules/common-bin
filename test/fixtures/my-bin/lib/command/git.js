'use strict';

const Command = require('../../../../..').Command;
const path = require('path');

class GitCommand extends Command {
  constructor() {
    super();
    this.name = 'git';
    this.description = 'git node process';

    this.loadCommand(path.join(__dirname, 'git_cmds'));
  }

  * run(context) {
    console.log('git %j', context);
  }
}

module.exports = GitCommand;
