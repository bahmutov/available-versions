'use strict';

var request = require('axios');
var la = require('lazy-ass');
var check = require('check-more-types');
var debug = require('debug')('vers');
// var gitlab = require('gitlab');

function urlFromGitHub(user, repo) {
  const githubUrl = 'https://api.github.com/repos/';
  const url = githubUrl + user + '/' + repo + '/releases';
  return url;
}

function isGitHub(type) {
  return type === 'github';
}

function isGitlab(type) {
  return type === 'gitlab';
}

function hasGitLabToken() {
  return check.unemptyString(process.env.GITLAB_AUTH_TOKEN);
}

function supportedServer(type) {
  return isGitHub(type) || (
    isGitlab(type) && hasGitLabToken()
  );
}

function fetchFromGitlab(repo) {
  la(repo.server === 'gitlab', 'invalid gitlab server', repo);
}

function fetchFromGitlab(available, repo) {
  la(isGitlab(repo.server), 'invalid gitlab server', repo);
  debug('fetching release notes from gitlab server');
  debug(repo);
  if (!hasGitLabToken()) {
    console.error('Missing gitlab access token');
    return available;
  }
  return available;
}

function fetchFromGitHub(available, repo) {
  la(isGitHub(repo.server), 'invalid github server', repo);
  const url = urlFromGitHub(repo.user, repo.repo);
  debug('fetching releases from github %s', url);

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

function fetchReleaseNotes(available) {
  debug('available', available);

  if (!available.repoParsed) {
    debug('no parsed repo');
    return available;
  }

  var type = available.repoParsed.server;
  if (!supportedServer(type)) {
    debug('do not know how to fetch releases from %s', type);
    return available;
  }

  if (isGitHub(type)) {
    return fetchFromGitHub(available, available.repoParsed);
  }
  if (isGitlab(type)) {
    return fetchFromGitlab(available, available.repoParsed);
  }

  return available;
}

module.exports = fetchReleaseNotes;
