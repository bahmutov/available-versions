'use strict';

const la = require('lazy-ass');
const is = require('check-more-types');
require('console.table');

const toHumanFormat = require('./human-format');

function verifyReleases(releases) {
  la(is.object(releases), 'wrong releases', releases);
  la(is.unemptyString(releases.name), 'missing name in', releases);
  la(is.array(releases.versions), 'no versions in', releases);
}

function printReleases(options, releases) {
  verifyReleases(releases);
  const humanInfo = toHumanFormat(releases);
  la(is.array(humanInfo), 'could not construct human output from', releases);
  la(humanInfo.every(is.defined),
    'found undefined entries in human formatted', humanInfo,
    'from releases', releases);

  const title = options.version ?
    releases.name + ' since ' + options.version :
    releases.name;
  console.table(title, humanInfo);
}

module.exports = printReleases;
