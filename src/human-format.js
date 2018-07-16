'use strict'

const debug = require('debug')('vers')
const la = require('lazy-ass')
const is = require('check-more-types')
const _ = require('lodash')
const moment = require('moment')
const semverAllowTags = require('./semver-allow-tags')
const replaceLinks = require('./replace-links')
const tagsByVersion = require('./utils').tagsByVersion

const releasesSchema = {
  versions: is.array,
  timestamps: is.maybe.array,
  'dist-tags': is.maybe.object,
  releases: is.maybe.array
}
const isReleases = is.schema(releasesSchema)

function versionsWithoutTimestamps (releases, tags) {
  const vers = releases.versions
  if (is.arrayOf(semverAllowTags, vers)) {
    debug('returning versions without timestamps')
    // debug(releases);
    return vers.map(version => {
      const result = {
        version: version
      }
      if (tags && tags[version]) {
        result['dist-tag'] = tags[version]
      }
      return result
    })
  }
  if (is.arrayOf(is.object, vers)) {
    la(
      vers.every(is.has('version')),
      'some objects do not have version property',
      releases
    )
    return _.pluck(vers, 'version')
  }
  throw new Error(
    'Cannot extract versions from ' + JSON.stringify(releases, null, 2)
  )
}

function withTimestamps (versions, timestamps, tags, now = moment()) {
  la(
    versions.length === timestamps.length,
    'mismatch in numbers',
    versions,
    timestamps
  )
  debug('withTimestamps tags: %j', tags)

  return versions.map(function (version, k) {
    const t = moment(timestamps[k])
    var result = {
      version: version,
      age: moment.duration(now.diff(t)).humanize()
    }
    if (tags && tags[version]) {
      result['dist-tag'] = tags[version]
    }
    return result
  })
}

function removeHtmlTags (s) {
  if (s.indexOf('<') !== -1) {
    return ''
  }
  return s
}

// remove useless lines that contain the version info
// like "## 1.1.0"
function removeHeaderStart (s) {
  const r = /^###? \d\d?\.\d\d?\./
  if (r.test(s)) {
    return ''
  }
  return s
}

// remove category?
// #### Features or #### Bug Fixes
// created by semantic-release
function removeCategory (s) {
  const r = /^#### (Features|Bug)/
  if (r.test(s)) {
    return ''
  }
  return s
}

// if the line starts with markdown "* " removes it
function removeMarkdownStar (s) {
  const r = /^\* /
  if (r.test(s)) {
    return s.substr(2)
  }
  return s
}

function removeBoldAroundScope (s) {
  const r = /^\*\*(\w+:)\*\* /
  const match = r.exec(s)
  // console.log(match);
  if (!match) {
    return s
  }
  return s.replace(match[0], match[1] + ' ')
}

function cleanReleaseNotesGitHub (notes) {
  la(is.unemptyString(notes), 'expected notes string', notes)
  const lines = notes
    .split('\n')
    .map(s => s.trim())
    .map(removeHtmlTags)
    .map(removeHeaderStart)
    .map(removeCategory)
    .map(replaceLinks)
    .map(removeMarkdownStar)
    .map(removeBoldAroundScope)
    .filter(is.unemptyString)
  return lines[0]
}

function cleanReleaseNotesGitLab (commit) {
  la(is.object(commit), 'missing commit', commit)
  la(is.string(commit.message), 'missing commit message in', commit)
  return commit.message.split('\n')[0].trim()
}

/*
  returns list of releases as objects, each one being
  {
    version: <semver>,
    age: N units (optional string),
    'dist-tag': (optional string),
    release: (optional string)
  }

  the "release" property comes from the GitHub (or maybe other supported)
  Git repos and is the Markdown of the release notes
*/
function toHumanFormat (releases, options) {
  la(isReleases(releases), 'invalid releases', releases)

  options = _.defaults(options, {
    now: moment()
  })

  const distTags = releases['dist-tags']
  la(is.maybe.object(distTags), 'wrong dist tags', distTags)
  debug('dist tags %j', distTags)
  const tags = tagsByVersion(distTags)
  debug('tags by version %j', tags)

  debug('has timestamps?', is.unemptyString(releases.timestamps))
  debug('options.now', options.now)
  const result = releases.timestamps
    ? withTimestamps(releases.versions, releases.timestamps, tags, options.now)
    : versionsWithoutTimestamps(releases, tags)

  if (is.array(releases.releases)) {
    result.forEach(function (r) {
      function versionMatch (o) {
        return o.name === r.version || o.name === 'v' + r.version
      }
      const release = _.find(releases.releases, versionMatch)
      // debug('for release %s found notes', r.version);
      // debug(release);

      if (release) {
        try {
          r.release = release.body
            ? cleanReleaseNotesGitHub(release.body)
            : cleanReleaseNotesGitLab(release.commit)
        } catch (e) {
          // ignore for now
        }
      }
    })
  }

  return result
}

module.exports = toHumanFormat
