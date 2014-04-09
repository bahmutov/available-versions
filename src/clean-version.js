var check = require('check-types');
var verify = check.verify;
var semver = require('semver');

var versionKeywords = {
  original: true,
  modified: true,
  created: true
};

function isKeyword(version) {
  return check.string(version) &&
    !!versionKeywords[version];
}

function clean(version) {
  var originalVersion = version;
  verify.unemptyString(version, 'missing version string' + version);

  if (check.webUrl(version)) {
    return;
  }
  if (isKeyword(version)) {
    return;
  }

  version = version.replace('~', '');
  var twoDigitVersion = /^\d+\.\d+$/;
  if (twoDigitVersion.test(version)) {
    version += '.0';
  }
  if (version === 'latest' || version === '*') {
    return;
  }
  try {
    version = semver.clean(version);
  } catch (err) {
    console.error('exception when cleaning version', version);
    return;
  }
  if (!version) {
    console.error('could not clean version ' + originalVersion);
    return;
  }
  return version;
}

function cleanVersion(version, name) {
  verify.unemptyString(version, 'missing version string' + version);
  verify.unemptyString(name, 'missing name string' + name);
  var cleaned = clean(version);
  if (!cleaned) {
    if (!isKeyword(version)) {
      console.error('could not clean version', version, 'for', name);
    }
    return;
  }
  return cleaned;
}

module.exports = cleanVersion;
