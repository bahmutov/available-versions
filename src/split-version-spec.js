const la = require('lazy-ass')
const is = require('check-more-types')

/* global describe, it */
describe('split version', function () {
  const split = require('./split-version')

  it('is a function', function () {
    la(is.fn(split))
  })

  it('handles just name', function () {
    const s = split('foo')
    la(is.object(s), s)
    la(s.name === 'foo', 'name', s)
    la(is.not.defined(s.version), 'version', s)
  })

  it('handles name and version', function () {
    const s = split('foo', '2.1.0')
    la(is.object(s), s)
    la(s.name === 'foo', 'name', s)
    la(s.version === '2.1.0', 'version', s)
  })

  it('can split version', function () {
    const s = split('foo@2.1.0')
    la(is.object(s), s)
    la(s.name === 'foo', 'name', s)
    la(s.version === '2.1.0', 'version', s)
  })

  it('handles scoped name with separate version', function () {
    const s = split('@user/foo', '2.1.0')
    la(is.object(s), s)
    la(s.name === '@user/foo', 'name', s)
    la(s.version === '2.1.0', 'version', s)
  })

  it('handles scoped name with included version', function () {
    const s = split('@user/foo@2.1.0')
    la(is.object(s), s)
    la(s.name === '@user/foo', 'name', s)
    la(s.version === '2.1.0', 'version', s)
  })
})
