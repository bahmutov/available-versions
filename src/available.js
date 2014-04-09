var request = require('request');
var check = require('check-types');
var verify = check.verify;
var semver = require('semver');
var q = require('q');
var cleanVersion = require('./clean-version');
var _ = require('lodash');

var _registryUrl = require('npm-utils').registryUrl;
verify.fn(_registryUrl, 'expected registry url function');
var registryUrl = _.once(_registryUrl);

function queryRegistry(query, silent, npmUrl) {
  verify.object(query, 'expected {name, version}');
  var name = query.name;
  verify.string(name, 'missing name string');

  verify.webUrl(npmUrl, 'need npm registry url, got ' + npmUrl);
  npmUrl = npmUrl.replace(/^https:/, 'http:').trim();
  var url = npmUrl + name;

  var deferred = q.defer();

  request.get(url, onNPMversions);

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
      var versions;
      if (info.time) {
        versions = Object.keys(info.time);
      } else if (info.versions) {
        versions = Object.keys(info.versions);
      }
      if (!Array.isArray(versions)) {
        throw new Error('Could not get versions for ' + name + ' from ' + info);
      }

      var validVersions = versions.filter(function (ver) {
        return cleanVersion(ver, name, silent);
      });
      if (query.version) {
        verify.string(query.version, 'missing version string, have ' + query.version);
        validVersions = validVersions.filter(function (ver) {
          var later = semver.gt(ver, query.version);
          return later;
        });
      }

      deferred.resolve({
        name: name,
        versions: validVersions
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
  verify.object(query, 'expected {name, version}');
  return registryUrl().then(queryRegistry.bind(null, query, !!silent));
}

module.exports = fetchVersions;
