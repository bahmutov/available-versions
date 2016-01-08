var request = require('request');
var la = require('lazy-ass');
var check = require('check-more-types');
var semver = require('semver');
var q = require('q');
var cleanVersion = require('./clean-version');
var _ = require('lodash');
var debug = require('debug')('vers');

var _registryUrl = require('npm-utils').registryUrl;
la(check.fn(_registryUrl), 'expected registry url function');
var registryUrl = _.once(_registryUrl);

function formUrl(npmUrl, name) {
  la(check.unemptyString(name), 'missing name string', name);

  la(check.webUrl(npmUrl), 'need npm registry url, got', npmUrl);
  npmUrl = npmUrl.replace(/^https:/, 'http:').trim();

  // for scoped package names that have @user/foo
  var url = npmUrl + name.replace('/', '%2f');
  return url;
}

function queryRegistry(query, silent, npmUrl) {
  la(check.object(query), 'expected {name, version}');
  var name = query.name;
  var url = formUrl(npmUrl, name);
  debug('query npm registry', url);

  var deferred = q.defer();

  request.get(url, onNPMversions);

  function getTimestamps(info, versions) {
    if (!check.object(info.time)) {
      return;
    }
    la(check.array(versions), 'expected list of versions', versions);
    return versions.map(function (v) {
      return info.time[v];
    });
  }

  function onNPMversions(err, response, body) {
    if (err) {
      console.error('ERROR when fetching info for package', name);
      return deferred.reject(new Error(err.message));
    }

    try {
      var info = JSON.parse(body);
      if (info.error) {
        var str = 'ERROR in npm info for ' + name + ' reason ' + (info.reason || body);
        console.error(str);
        deferred.reject(new Error(str));
        return;
      }
      var versionObject = info.versions || info.time;
      la(check.object(versionObject), 'could not find versions in', info);

      var versions = Object.keys(versionObject);
      if (!Array.isArray(versions)) {
        throw new Error('Could not get versions for ' + name + ' from ' + info);
      }

      var validVersions = versions.filter(function (ver) {
        return cleanVersion(ver, name, silent);
      });

      if (query.version) {
        la(check.string(query.version), 'missing version string, have', query.version);
        validVersions = validVersions.filter(function (ver) {
          var later = semver.gt(ver, query.version);
          return later;
        });
      }

      var timestamps = getTimestamps(info, validVersions);
      la(check.maybe.array(timestamps),
        'expected list of timestamps', timestamps);

      la(check.maybe.object(info['dist-tags']),
        'expected object with dist tags', info['dist-tags']);

      deferred.resolve({
        name: name,
        versions: validVersions,
        timestamps: timestamps,
        'dist-tags': info['dist-tags']
      });

      return;
    } catch (error) {
      console.error(error);
      deferred.reject(new Error('Could not fetch versions for ' + name));
      return;
    }
  }
  return deferred.promise;
}

// fetching versions inspired by
// https://github.com/jprichardson/npm-latest
// returns a promise
function fetchVersions(query, silent) {
  if (typeof query === 'string') {
    query = {
      name: query
    };
  }
  la(check.object(query), 'expected {name, version}');
  var queryFn = _.partial(queryRegistry, query, Boolean(silent));
  return registryUrl()
    .then(queryFn);
}

module.exports = fetchVersions;
