'use strict';

var request = require('axios');
var la = require('lazy-ass');
var check = require('check-more-types');
var debug = require('debug')('vers');

const githubUrl = 'https://api.github.com/repos/';
// octocat/Hello-World/releases/1

function getReleaseNotes(url) {
  la(check.unemptyString(url), 'missing full url', url);
  return request.get(url)
    .then((r) => {
      debug('response to', url);
      debug(r);
    })
    .catch(() => {
      debug('could not get release notes', url);
    });
}

function fetchReleaseNotes(available) {
  debug('available', available);

  if (!available.repoParsed) {
    debug('no parsed repo');
    return available;
  }

  const url = githubUrl + available.repoParsed.user + '/' +
    available.repoParsed.repo + '/releases/v';
  debug('creating %d fetch promises', available.versions.length);
  const promises = available.versions.map((version) => {
    const fullUrl = url + version;
    return getReleaseNotes(fullUrl);
  });

  return Promise.all(promises)
    .then((results) => {
      debug('fetched release notes');
      debug(results);
    })
    .then(() => {
      return available;
    })
    .catch((err) => {
      console.error('error fetching release notes');
      console.error(err);
      return available;
    });
}

module.exports = fetchReleaseNotes;
