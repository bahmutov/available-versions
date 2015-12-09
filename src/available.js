var request = require('request');
var la = require('lazy-ass');
var check = require('check-more-types');
var semver = require('semver');
var q = require('q');
var cleanVersion = require('./clean-version');
var _ = require('lodash');

var _registryUrl = require('npm-utils').registryUrl;
la(check.fn(_registryUrl), 'expected registry url function');
var registryUrl = _.once(_registryUrl);

function queryRegistry(query, silent, npmUrl) {
  la(check.object(query), 'expected {name, version}');
  var name = query.name;
  la(check.string(name), 'missing name string');

  la(check.webUrl(npmUrl), 'need npm registry url, got', npmUrl);
  npmUrl = npmUrl.replace(/^https:/, 'http:').trim();
  var url = npmUrl + name;

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
      deferred.reject(err.message);
      return;
    }

    try {
      var info = JSON.parse(body);
      if (info.error) {
        var str = 'ERROR in npm info for ' + name + ' reason ' + info.reason;
        console.error(str);
        deferred.reject(str);
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

      deferred.resolve({
        name: name,
        versions: validVersions,
        timestamps: timestamps
      });

      return;
    } catch (err) {
      console.error(err);
      deferred.reject('Could not fetch versions for ' + name);
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
  return registryUrl().then(queryRegistry.bind(null, query, !!silent));
}

module.exports = fetchVersions;
