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
      console.log('response to', url);
      console.log(r);
    })
    .catch(() => {
      debug('could not get release notes', url);
    });
}

function fetchReleaseNotes(available) {
  console.log('available', available);

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
      console.log('fetched');
      console.log(results);
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
