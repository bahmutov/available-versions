#!/usr/bin/env node --harmony

'use strict';

var help = [
  'USE: jso <property name prefix>',
  '    "jso v" === "cat package.json | grep version"'
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

