const la = require('lazy-ass');
const is = require('check-more-types');
const moment = require('moment');

function toHumanFormat(versions, timestamps) {
  la(is.array(versions), 'invalid versions', versions);
  la(is.array(timestamps), 'invalid timestamps', timestamps);
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

module.exports = toHumanFormat;
