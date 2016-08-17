'use strict';

const la = require('lazy-ass');
const is = require('check-more-types');
const parseUrl = require('url').parse;

const gitHttps = /^git\+https:\/\//;
const gitAt = /^git@/;

function isGitHub(hostname) {
  return hostname.indexOf('github') !== -1;
}

function parseGitHttps(url) {
  la(gitHttps.test(url), 'invalid', url);
  const removedGit = url.replace(/^git\+/, '');
  const parsed = parseUrl(removedGit);
  if (isGitHub(parsed.hostname)) {
    return parsed.protocol + '//api.' + parsed.hostname;
  }
  return parsed.protocol + '//' + parsed.hostname;
}

function parseGitAt(url) {
  la(gitAt.test(url), 'invalid', url);
  const removedGit = url.replace(gitAt, '');
  const parts = removedGit.split(':');
  return 'https://' + parts[0];
}

function server(url) {
  la(is.unemptyString(url), 'expected git server url', url);
  if (gitHttps.test(url)) {
    return parseGitHttps(url);
  }
  if (gitAt.test(url)) {
    return parseGitAt(url);
  }
}

module.exports = server;
