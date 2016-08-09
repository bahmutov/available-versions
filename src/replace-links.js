'use strict';

// replace urls like
// ([a00ed3e7](https://github.com/bahmutov/manpm/commit/a00ed3e7))
// with just SHA "a00ed3e7"
function replaceLinks(s) {
  const r = /\(\[([0-9a-f]{8})\]\([\w:\.\/]+\)\)/;
  const match = r.exec(s);
  if (!match) {
    return s;
  }
  // console.log(match);
  return s.replace(match[0], match[1]);
}

module.exports = replaceLinks;
