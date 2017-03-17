'use strict';

const path = require('path');
const Command = require('../../../..');

class InstallCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.yargs.options({
      name: {
        description: 'package name',
      },
    });
  }

  * run({ cwd, argv }) {
    const name = argv.target;
    yield this.helper.npmInstall(process.platform === 'win32' ? 'npm.cmd' : 'npm', name, cwd);
    const pkgInfo = require(path.join(cwd, 'node_modules', name, 'package.json'));
    console.log(`install ${pkgInfo.name} done`);
  }

  get description() {
    return 'run npm install';
  }
}

module.exports = InstallCommand;
