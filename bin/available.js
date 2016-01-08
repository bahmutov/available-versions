#!/usr/bin/env node --harmony

'use strict';

var help = [
  'USE: vers <module name> [start version]',
  '    "vers chalk"',
  '    "vers chalk 0.3.0"',
].join('\n');

var available = require('..');

require('simple-bin-help')({
  minArguments: 3,
  packagePath: __dirname + '/../package.json',
  help: help
});

const options = require('../src/split-version')(process.argv[2], process.argv[3]);

var hideDebugOutput = true;

const printReleases = require('../src/print-releases');

available(options, hideDebugOutput)
  .then(printReleases.bind(null, options))
  .done();

