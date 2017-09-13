'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const parseUrl = require('url').parse

const gitHttps = /^git\+https:\/\//
const gitAt = /^git@/
const gitProtocol = /^git:\/\//
const gitSsh = /^git\+ssh:\/\/git@/

function isGitHub (hostname) {
  la(is.unemptyString(hostname), 'missing hostname', hostname)
  return hostname.indexOf('github') !== -1
}

function apiUrlFromParseable (url) {
  const parsed = parseUrl(url)
  la(is.unemptyString(parsed.hostname),
    'missing hostname in parsed', parsed, 'from url', url)

  const protocol = parsed.protocol ? parsed.protocol : 'https:'
  if (isGitHub(parsed.hostname)) {
    return protocol + '//api.' + parsed.hostname
  }
  return protocol + '//' + parsed.hostname
}

function parseGitHttps (url) {
  la(gitHttps.test(url), 'invalid', url)
  const removedGit = url.replace(/^git\+/, '')
  return apiUrlFromParseable(removedGit)
}

function parseGitAt (url) {
  la(gitAt.test(url), 'invalid', url)
  const removedGit = url.replace(gitAt, '')
  const parts = removedGit.split(':')
  return 'https://' + parts[0]
}

function parseGitProtocol (url) {
  la(gitProtocol.test(url), 'invalid', url)
  const removedGit = url.replace(gitProtocol, 'https://')
  return apiUrlFromParseable(removedGit)
}

function parseGitSsh (url) {
  la(gitSsh.test(url), 'invalid', url)
  const removedGit = url.replace(gitSsh, 'https://')
  return apiUrlFromParseable(removedGit)
}

function server (url) {
  la(is.unemptyString(url), 'expected git server url', url)
  if (gitHttps.test(url)) {
    return parseGitHttps(url)
  }
  if (gitSsh.test(url)) {
    return parseGitSsh(url)
  }
  if (gitAt.test(url)) {
    return parseGitAt(url)
  }
  if (gitProtocol.test(url)) {
    return parseGitProtocol(url)
  }

  // try simple parsing
  return apiUrlFromParseable(url)
}

module.exports = server
