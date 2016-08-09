'use strict';

// replaces links to issues with just the number
// [#11](https://github.com/bahmutov/manpm/issues/11)
// becomes just #11
function replaceIssueLinks(s) {
  const r = /\[(#\d+)\]\([\w:\.\-\/]+\)/;
  const match = r.exec(s);
  // console.log(match);
  if (!match) {
    return s;
  }
  return s.replace(match[0], match[1]);
}

// replace urls like
// ([a00ed3e7](https://github.com/bahmutov/manpm/commit/a00ed3e7))
// with just SHA (a00ed3e7)
function replaceLinks(s) {
  const r = /\[([0-9a-f]{8})\]\([\w:\.\-\/]+\)/;
  const match = r.exec(s);
  // console.log(match);
  if (!match) {
    return s;
  }
  return s.replace(match[0], match[1]);
}

function removeLinks(s) {
  return replaceIssueLinks(replaceLinks(s));
}

module.exports = removeLinks;
