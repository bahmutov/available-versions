'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
var debug = require('debug')('vers')
require('console.table')

const toHumanFormat = require('./human-format')

function verifyReleases (releases) {
  la(is.object(releases), 'wrong releases', releases)
  la(is.unemptyString(releases.name), 'missing name in', releases)
  la(is.array(releases.versions), 'no versions in', releases)
}

function printReleases (options, releases) {
  debug('printing releases')
  verifyReleases(releases)
  const humanInfo = toHumanFormat(releases)
  la(is.array(humanInfo), 'could not construct human output from', releases)
  la(humanInfo.every(is.defined),
    'found undefined entries in human formatted', humanInfo,
    'from releases', releases)

  const title = options.version
    ? releases.name + ' since ' + options.version
    : releases.name
  const fullTitle = releases.repo
    ? title + ' from ' + releases.repo : title
  console.table(fullTitle, humanInfo)
}

module.exports = printReleases
