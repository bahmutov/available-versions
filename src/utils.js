const is = require('check-more-types')

/*
  given an object with tags (keys) and versions (values)
  inverts it and for each version has a list of tags

  {latest: '2.0.0', dev: '2.1.0'} -> {'2.0.0': 'latest', '2.1.0': 'dev'}
  {latest: '2.1.0', dev: '2.1.0'} -> {'2.1.0': 'latest, dev'}
*/
function tagsByVersion (distTags) {
  if (!is.object(distTags)) {
    return undefined
  }
  const tags = {}
  Object.keys(distTags).forEach(function (tag) {
    const version = distTags[tag]
    if (tags[version]) {
      tags[version] += ', ' + tag
    } else {
      tags[version] = tag
    }
  })
  return tags
}

module.exports = {
  tagsByVersion: tagsByVersion
}
