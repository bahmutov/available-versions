'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const snapshot = require('snap-shot-it')
const moment = require('moment')

/* eslint-env mocha */
describe('is.semver', function () {
  it('handles clean list', function () {
    var versions = ['0.0.0', '0.0.2', '0.1.0']
    la(is.arrayOf(is.semver, versions), 'not sem vers', versions)
  })

  it('does not like tags', function () {
    la(is.semver('0.0.1'), 'plain semver')
    la(!is.semver('0.0.1-beta'), 'semver with tag')
    la(!is.semver('5.0.0-alpha.13'), 'semver with alpha and number')
  })

  it('does not like tags in list', function () {
    var versions = ['0.0.0-semantic-release', '0.0.0', '0.1.0']
    la(!is.arrayOf(is.semver, versions), 'not sem vers', versions)
  })
})

describe('human format conversion', function () {
  const toHuman = require('./human-format')

  it('is a function', function () {
    la(is.fn(toHuman))
  })

  function checkProps (release) {
    la(is.semver(release.version), 'missing version', release)
    la(is.maybe.unemptyString(release.age), 'missing age', release)
    la(is.maybe.unemptyString(release['dist-tag']), 'wrong dist tag', release)
  }

  function checkOutput (human) {
    la(is.array(human), 'not array', human)
    la(
      human.every(is.defined),
      'found undefined entries in human formatted',
      human
    )
    human.every(checkProps)
  }

  it('handles with valid timestamps', function () {
    const releases = {
      name: 'ci-publish',
      versions: ['1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.1.0'],
      timestamps: [
        '2016-01-07T20:49:10.977Z',
        '2016-01-07T20:54:08.557Z',
        '2016-01-07T20:59:05.577Z',
        '2016-01-07T21:15:00.188Z',
        '2016-01-07T21:15:40.930Z',
        '2016-01-08T03:27:18.522Z'
      ],
      'dist-tags': {
        latest: '1.1.0'
      }
    }
    const human = toHuman(releases)
    la(human.length === releases.versions.length, 'wrong number of versions')
    checkOutput(human)
  })

  it('handles several tags', function () {
    const releases = {
      name: 'ci-publish',
      versions: ['1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.1.0'],
      timestamps: [
        '2016-01-07T20:49:10.977Z',
        '2016-01-07T20:54:08.557Z',
        '2016-01-07T20:59:05.577Z',
        '2016-01-07T21:15:00.188Z',
        '2016-01-07T21:15:40.930Z',
        '2016-01-08T03:27:18.522Z'
      ],
      'dist-tags': {
        latest: '1.1.0',
        dev: '1.1.0',
        old: '1.0.0'
      }
    }
    const options = {
      now: moment('2018-06-01')
    }
    const human = toHuman(releases, options)
    la(human.length === releases.versions.length, 'wrong number of versions')
    checkOutput(human)
    snapshot(human)
  })

  it('handles undefined timestamps', function () {
    const releases = {
      name: 'ci-publish',
      versions: ['1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.1.0'],
      timestamps: undefined,
      'dist-tags': {
        latest: '1.1.0'
      }
    }
    const human = toHuman(releases)
    la(human.length === releases.versions.length, 'wrong number of versions')
    checkOutput(human)
  })

  it('handles just versions', function () {
    const releases = {
      name: 'ci-publish',
      versions: ['1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.1.0']
    }
    const human = toHuman(releases)
    la(human.length === releases.versions.length, 'wrong number of versions')
    checkOutput(human)
  })

  it('adds release notes', function () {
    const releases = {
      name: 'ci-publish',
      versions: ['1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.1.0'],
      releases: [
        {
          name: 'v1.0.0',
          body: 'first release'
        },
        {
          name: 'v1.0.1',
          body: 'little fix'
        }
      ]
    }
    const human = toHuman(releases)
    la(human.length === releases.versions.length, 'wrong number of versions')
    checkOutput(human)
    la(
      human[0].version === '1.0.0',
      'expected first version at first position',
      human[0]
    )
    la(human[0].release, 'missing release notes at first position', human[0])
    // console.log(human);
  })

  it('cleans multi line notes', function () {
    const releases = {
      name: 'ci-publish',
      versions: ['1.0.0'],
      releases: [
        {
          name: 'v1.0.0',
          body: 'first release\n\nsecond line\n'
        },
        {
          name: 'v1.0.1',
          body: 'little fix'
        }
      ]
    }
    const human = toHuman(releases)
    la(human.length === releases.versions.length, 'wrong number of versions')
    checkOutput(human)
    const notes = human[0].release
    la(is.unemptyString(notes), 'missing notes', human)
    la(
      is.not.found(notes.indexOf('second line')),
      'did not remove second line',
      notes
    )
  })

  it('removes HTML tags', function () {
    const releases = {
      name: 'ci-publish',
      versions: ['1.0.0'],
      releases: [
        {
          name: 'v1.0.0',
          body: '<a name"foo">nice</a>\nfirst release\n\nsecond line\n'
        },
        {
          name: 'v1.0.1',
          body: 'little fix'
        }
      ]
    }
    const human = toHuman(releases)
    la(human.length === releases.versions.length, 'wrong number of versions')
    checkOutput(human)
    const notes = human[0].release
    la(is.unemptyString(notes), 'missing notes', human)
    la(is.not.found(notes.indexOf('nice')), 'did not remove html line', notes)
    la(
      is.not.found(notes.indexOf('second line')),
      'did not remove second line',
      notes
    )
    console.log(notes)
  })
})
