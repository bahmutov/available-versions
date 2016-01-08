const la = require('lazy-ass');
const is = require('check-more-types');
const moment = require('moment');
const _ = require('lodash');

const releasesSchema = {
  versions: is.array,
  timestamps: is.maybe.array,
  'dist-tags': is.maybe.object
};
const isReleases = _.partial(is.schema, releasesSchema);

function withoutTimestamps(releases) {
  const vers = releases.versions;
  if (is.arrayOf(is.semver, vers)) {
    return vers;
  }
  if (is.arrayOf(is.object, vers)) {
    la(vers.every(is.has('version')),
      'some objects do not have version property ' +
      JSON.stringify(releases, null, 2));
    return _.pluck(vers, 'version');
  }
  throw new Error('Cannot extract versions from ' +
    JSON.stringify(releases, null, 2));
}

function withTimestamps(versions, timestamps, tags) {
  la(versions.length === timestamps.length,
    'mismatch in numbers', versions, timestamps);

  const now = moment();
  return versions.map(function (version, k) {
    const t = moment(timestamps[k]);
    var result = {
      version: version,
      age: moment.duration(now.diff(t)).humanize()
    };
    if (tags && tags[version]) {
      result['dist-tag'] = tags[version];
    }
    return result;
  });
}

function toHumanFormat(releases) {
  la(isReleases(releases), 'invalid releases', releases);

  const distTags = releases['dist-tags'];
  la(is.maybe.object(distTags), 'wrong dist tags', distTags);
  const tags = is.object(distTags) ? _.invert(distTags) : undefined;

  if (!releases.timestamps) {
    return withoutTimestamps(releases);
  }

  return withTimestamps(releases.versions, releases.timestamps, tags);
}

module.exports = toHumanFormat;
