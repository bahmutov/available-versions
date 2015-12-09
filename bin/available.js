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

var name = process.argv[2];
var version = process.argv[3]; // optional
var hideDebugOutput = true;

const options = {
  name: name,
  version: version
};

available(options, hideDebugOutput)
  .then(console.log.bind(console))
  .done();

