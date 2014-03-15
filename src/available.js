var request = require('request');
var check = require('check-types');
var verify = check.verify;
var semver = require('semver');
var q = require('q');
var isUrl = require('npm-utils').isUrl;
var _ = require('lodash');

var _registryUrl = require('npm-utils').registryUrl;
verify.fn(_registryUrl, 'expected registry url function');
var registryUrl = _.once(_registryUrl);

function cleanVersion(version, name) {
  var originalVersion = version;
  verify.unemptyString(version, 'missing version string' + version);
  verify.unemptyString(name, 'missing name string' + name);

  if (isUrl(version)) {
    console.log('Cannot handle git repos, skipping', name, 'at', version);
    return;
  }
  if (version === 'original' ||
    version === 'modified' ||
    version === 'created') {
    return;
  }

  version = version.replace('~', '');
  var twoDigitVersion = /^\d+\.\d+$/;
  if (twoDigitVersion.test(version)) {
    version += '.0';
  }
  if (version === 'latest' || version === '*') {
    console.log('Module', name, 'uses version', version);
    console.log('It is recommented to list a specific version number');
    throw new Error('Unspecified version for module ' + name);
  }
  try {
    version = semver.clean(version);
  } catch (err) {
    console.error('exception when cleaning version', version);
    return;
  }
  if (!version) {
    console.error('could not clean version ' + originalVersion + ' for ' + name);
    return;
  }
  console.assert(version, 'missing clean version ' + originalVersion + ' for ' + name);
  return version;
}

function cleanVersionPair(nameVersion) {
  check.verify.array(nameVersion, 'expected and array');
  console.assert(nameVersion.length === 2,
    'expected 2 items, name and version ' + nameVersion);
  var name = nameVersion[0];
  check.verify.string(name, 'could not get module name from ' + nameVersion);

  var version = nameVersion[1];
  check.verify.string(version, 'could not get module version from ' + nameVersion);
  version = cleanVersion(version, name);
  if (!version) {
    return;
  }

  nameVersion[1] = version;
  return nameVersion;
}

function queryRegistry(query, npmUrl) {
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
        return cleanVersion(ver, name);
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
function fetchVersions(query) {
  verify.object(query, 'expected {name, version}');
  return registryUrl().then(queryRegistry.bind(null, query));
}

fetchVersions.cleanVersion = cleanVersion;
module.exports = fetchVersions;
