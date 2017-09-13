'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')

/* global describe, it */
describe('semver with tag', function () {
  const semverAllowTags = require('./semver-allow-tags')

  it('handles major.minor.patch', function () {
    la(semverAllowTags('0.0.1'), 'plain semver')
  })

  it('handles alpha tags', function () {
    la(semverAllowTags('0.0.1-beta'))
  })

  it('handles tags with numbers', function () {
    la(semverAllowTags('0.0.1-beta2'))
  })

  it('handles tags with numbers', function () {
    la(semverAllowTags('0.0.1-alpha.13'))
  })

  it('handles tags with numbers and dashes', function () {
    la(semverAllowTags('0.0.1-alpha-13'))
  })

  it('handles list with tags', function () {
    var versions = [
      '0.0.0-semantic-release',
      '0.0.0',
      '0.1.0'
    ]
    la(is.arrayOf(semverAllowTags, versions),
      'not sem vers', versions)
  })
})
