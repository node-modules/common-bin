import * as CommonBin from '../../..';
import * as path from 'path';

// test bin
const bin = new CommonBin(['egg-bin', 'test']);
bin.add('test', CommonBin);
bin.alias('t', 'test');
bin.load(path.resolve(__dirname, '../async-bin/command'));
bin.showHelp();
bin.start();

// custom bin
class CustomBin extends CommonBin {
  constructor(rawArgv) {
    super(rawArgv);
    this.run();
    console.info(this.usage);
    console.info(this.version);
    console.info(this.yargs.version);
    console.info(this.context.argv);
    console.info(this.context.cwd);
    console.info(this.context.rawArgv.slice(0));
    console.info(this.context.execArgv.slice(0));
    this.options = {
      depth: {
        type: 'number',
        description: 'Create a shallow clone with a history truncated to the specified number of commits',
      },
    };
  }

  errorHandler(e: Error) {
    console.info(e);
    super.errorHandler(e);
  }
}
const customBin = new CustomBin(['egg-bin', 'test']);
customBin.start();

// test helper
bin.helper.callFn(function* test() {
  return '666';
}, undefined, bin);
bin.helper.callFn<string>(function* test() {
  return '666';
});
bin.helper.callFn<number>(function* test() {
  return 666;
});
bin.helper.callFn<string, [ string ]>(function* test(key) {
  return key.substring(0);
}, [ '123' ]);
bin.helper.forkNode(path.resolve(__dirname, '../async-bin/index.js'), ['--help'], {
  cwd: path.resolve(__dirname, '../async-bin'),
});
bin.helper.spawn('node', [path.resolve(__dirname, '../async-bin/index.js'), '--help'], {
  cwd: path.resolve(__dirname, '../async-bin'),
});
bin.helper.npmInstall('npm', 'common-bin');
bin.helper.unparseArgv({ k: 'val' }, {
  includes: [ '--flag' ],
}).slice(0);
bin.helper.extractExecArgv({ k: 'val' }).debugOptions;
