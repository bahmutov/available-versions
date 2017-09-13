'use strict'

var request = require('axios')
var la = require('lazy-ass')
var check = require('check-more-types')
var debug = require('debug')('vers')
var parseGitServerUrl = require('./git-server-url')

function githubRemoteApi (url, user, repo) {
  const server = parseGitServerUrl(url)
  la(check.unemptyString(server), 'missing remote server url from', url)
  const apiUrl = server + '/repos/' + user + '/' + repo + '/releases'
  return apiUrl
}

function gitlabRemoteApi (url, user, repo) {
  const server = parseGitServerUrl(url)
  la(check.unemptyString(server), 'missing remote server url from', url)
  const apiUrl = server + '/api/v3/projects/' + user + '%2F' + repo + '/repository/tags'
  return apiUrl
}

function isGitHub (type) {
  return type === 'github'
}

function isGitlab (type) {
  return type === 'gitlab'
}

function hasGitLabToken () {
  return check.unemptyString(process.env.GITLAB_AUTH_TOKEN)
}

function supportedServer (type) {
  return isGitHub(type) || (
    isGitlab(type) && hasGitLabToken()
  )
}

function is200 (r) {
  la(r.status === 200, 'received error status', r.status)
  return r.data
}

function fetchFromGitlab (available, repo) {
  la(isGitlab(repo.server), 'invalid gitlab server', repo)

  debug('fetching release notes from gitlab server')
  debug(repo)

  const url = gitlabRemoteApi(repo.url, repo.user, repo.repo)
  debug('fetching releases from gitlab %s', url)

  if (!hasGitLabToken()) {
    console.error('Missing gitlab access token')
    return available
  }

  var options = {
    method: 'GET',
    url: url,
    headers: {
      'PRIVATE-TOKEN': process.env.GITLAB_AUTH_TOKEN
    }
  }
  return request(options)
    .then(is200)
    .then(function (list) {
      la(check.array(list), 'expected list of tags', list)
      debug('fetched %d tags from gitlab', list.length)
      available.releases = list
      return available
    })
    .catch(function (err) {
      debug('error fetching release notes from', url)
      debug(err)
      return available
    })
}

function fetchFromGitHub (available, repo) {
  la(isGitHub(repo.server), 'invalid github server', repo)
  const url = githubRemoteApi(repo.url, repo.user, repo.repo)
  debug('fetching releases from github %s', url)

  return request.get(url)
    .then(is200)
    .then(function (list) {
      debug('got %d releases', list.length)
      la(check.array(list), 'expected list of releases', list)
      la(check.positive(list.length), 'invalid releases number', list.length)
      available.releases = list
      return available
    })
    .catch(function (err) {
      debug('error fetching release notes from', url)
      debug(err)
      return available
    })
}

function fetchReleaseNotes (available) {
  debug('available', available)

  if (!available.repoParsed) {
    debug('no parsed repo')
    return available
  }

  var type = available.repoParsed.server
  if (!supportedServer(type)) {
    debug('do not know how to fetch releases from %s', type)
    return available
  }

  if (isGitHub(type)) {
    return fetchFromGitHub(available, available.repoParsed)
  }
  if (isGitlab(type)) {
    return fetchFromGitlab(available, available.repoParsed)
  }

  return available
}

module.exports = fetchReleaseNotes
