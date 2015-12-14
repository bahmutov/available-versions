const la = require('lazy-ass');
const is = require('check-more-types');
require('console.table');

const toHumanFormat = require('./human-format');

function printReleases(options, releases) {
  la(is.object(releases), 'wrong releases', releases);

  la(is.unemptyString(releases.name), 'missing name in', releases);

  la(is.array(releases.versions), 'no versions in', releases);
  const humanInfo = toHumanFormat(releases.versions, releases.timestamps);
  la(is.array(humanInfo), 'could not construct human output from', releases);

  const title = options.version ?
    releases.name + ' since ' + options.version :
    releases.name;
  console.table(title, humanInfo);
}

module.exports = printReleases;
