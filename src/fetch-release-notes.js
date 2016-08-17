'use strict';

var request = require('axios');
var la = require('lazy-ass');
var check = require('check-more-types');
var debug = require('debug')('vers');

function urlFromGitHub(user, repo) {
  const githubUrl = 'https://api.github.com/repos/';
  const url = githubUrl + user + '/' + repo + '/releases';
  return url;
}

function supportedServer(type) {
  return type === 'github';
}

function fetchReleaseNotes(available) {
  debug('available', available);

  if (!available.repoParsed) {
    debug('no parsed repo');
    return available;
  }
  if (!supportedServer(available.repoParsed.server)) {
    debug('do not know how to fetch releases from %s',
      available.repoParsed.server);
    return available;
  }

  const url = urlFromGitHub(available.repoParsed.user,
    available.repoParsed.repo);
  debug('fetching releases from %s', url);

  return request.get(url)
    .then(function (r) {
      la(r.status === 200, 'received error status', r.status);
      return r.data;
    })
    .then(function (list) {
      debug('got %d releases', list.length);
      la(check.array(list), 'expected list of releases', list);
      la(check.positive(list.length), 'invalid releases number', list.length);
      available.releases = list;
      return available;
    })
    .catch(function (err) {
      debug('error fetching release notes');
      debug(err);
      return available;
    });
}

module.exports = fetchReleaseNotes;
