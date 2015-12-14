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

function hasAt(s) {
  return s.indexOf('@') !== -1;
}

if (hasAt(name) && !version) {
  name = process.argv[2].split('@')[0];
  version = process.argv[2].split('@')[1];
}

const options = {
  name: name,
  version: version
};

const printReleases = require('../src/print-releases');

available(options, hideDebugOutput)
  .then(printReleases.bind(null, options))
  .done();

