const is = require('check-more-types');

function isSemverWithTag (str) {
  return /^\d+\.\d+\.\d+(-[a-zA-Z0-9\.]+)*$/.test(str);
}

function semverAllowTags (str) {
  return is.unemptyString(str) &&
    (is.semver(str) || isSemverWithTag(str));
}

module.exports = semverAllowTags;
