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
  return _.pluck(releases.versions, 'version');
}

function withTimestamps(versions, timestamps, distTags) {
  la(versions.length === timestamps.length,
    'mismatch in numbers', versions, timestamps);
  la(is.maybe.object(distTags), 'wrong dist tags', distTags);

  const tags = is.object(distTags) ? _.invert(distTags) : undefined;

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

  if (!releases.timestamps) {
    return withoutTimestamps(releases);
  }

  return withTimestamps(releases.versions, releases.timestamps, releases['dist-tags']);
}

module.exports = toHumanFormat;
