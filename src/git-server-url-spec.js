'use strict';

const la = require('lazy-ass');
const is = require('check-more-types');

/* global describe, it */
describe('git server url', function () {
  const server = require('./git-server-url');

  it('is a function', function () {
    la(is.fn(server));
  });

  it('returns gitlab url', function () {
    var git = 'git+https://gitlab.com/hutson/semantic-release-gitlab.git';
    var url = server(git);
    la(is.unemptyString(url), 'returns a string', url);
    la(url === 'https://gitlab.com', url);
  });

  it('returns gitlab git@ url', function () {
    var git = 'git@gitlab.kensho.com:gleb/fe1-proxy.git';
    var url = server(git);
    la(url === 'https://gitlab.kensho.com', url);
  });

  it('returns github url', function () {
    var git = 'git+https://github.com/bahmutov/manpm.git';
    var url = server(git);
    la(url === 'https://github.com', url);
  });
});
