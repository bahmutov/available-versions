#!/usr/bin/env node --harmony

'use strict';

const la = require('lazy-ass');
const check = require('check-more-types');
require('console.table');
const moment = require('moment');

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

function toHumanFormat(versions, timestamps) {
  la(check.array(versions), 'invalid versions', versions);
  la(check.array(timestamps), 'invalid timestamps', timestamps);
  la(versions.length === timestamps.length,
    'mismatch in numbers', versions, timestamps);
  const now = moment();
  return versions.map(function (version, k) {
    const t = moment(timestamps[k]);
    return {
      version: version,
      timestamp: t,
      age: moment.duration(now.diff(t)).humanize()
    };
  });
}

function printReleases(query, releases) {
  la(check.object(releases), 'wrong releases', releases);

  la(check.unemptyString(releases.name), 'missing name in', releases);

  la(check.array(releases.versions), 'no versions in', releases);
  const humanInfo = toHumanFormat(releases.versions, releases.timestamps);
  la(check.array(humanInfo), 'could not construct human output from', releases);

  const title = options.version ?
    releases.name + ' since ' + options.version :
    releases.name;
  console.table(title, humanInfo);
}

available(options, hideDebugOutput)
  .then(printReleases.bind(null, options))
  .done();

