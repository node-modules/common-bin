'use strict';

const Command = require('../../../../..').Command;
const path = require('path');

class GitCommand extends Command {
  constructor() {
    super();
    this.name = 'git';
    this.description = 'git node process';
    const BranchCommand = require(path.join(__dirname, 'git_cmds/branch'));
    const command = new BranchCommand();

    this.commands.set('branch', command);
  }

  * run(context) {
    const command = this.commands.get(context.argv._[0]);
    if (command) {
      // exec sub command
      context.argv._ = context.argv._.slice(1);
      yield command.run(context);
    } else {
      console.log('xxx');
    }
  }
}

module.exports = GitCommand;
