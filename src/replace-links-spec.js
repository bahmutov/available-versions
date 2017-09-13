'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const replaceLinks = require('./replace-links')

/* global describe, it */
describe('replace links', () => {
  it('is a function', () => {
    la(is.fn(replaceLinks))
  })

  it('replaces SHA links', () => {
    const s = 'foo ([a00ed3e7](https://something/a00ed3e7))'
    const r = replaceLinks(s)
    la(r === 'foo (a00ed3e7)', r)
  })

  it('replaces SHA links surrounded by text', () => {
    const s = 'foo ([a00ed3e7](https://something/a00ed3e7)) bar'
    const r = replaceLinks(s)
    la(r === 'foo (a00ed3e7) bar', r)
  })

  it('replaces in full github url', () => {
    const s = '([c1e87cc9](https://github.com/bahmutov/manpm/commit/c1e87cc9))'
    const r = replaceLinks(s)
    la(r === '(c1e87cc9)', r)
  })

  it('replaces in longer string', () => {
    const s = 'Finds section by text in the heading ' +
      '([c1e87cc9](https://github.com/bahmutov/manpm/commit/c1e87cc9))'
    const r = replaceLinks(s)
    la(r === 'Finds section by text in the heading (c1e87cc9)', r)
  })

  it('replaces in string with markdown', () => {
    const s = '* **search:** Finds section by text in the heading ' +
      '([c1e87cc9](https://github.com/bahmutov/manpm/commit/c1e87cc9))'
    const r = replaceLinks(s)
    la(r === '* **search:** Finds section by text in the heading (c1e87cc9)', r)
  })

  it('replaces urls in string with two links', () => {
    const s = '([a360d56e](https://github.com/bahmutov/manpm/commit/a360d56e)' +
      ', closes [#11](https://github.com/bahmutov/manpm/issues/11))'
    const r = replaceLinks(s)
    la(r === '(a360d56e, closes #11)', r)
  })

  it('replaces several issue links', () => {
    const s = 'closes [#11](https://github.com/bahmutov/manpm/issues/11),' +
      ' and fixes [#12](https://github.com/bahmutov/manpm/issues/12)'
    const r = replaceLinks(s)
    la(r === 'closes #11, and fixes #12', r)
  })

  it('handles dashes', () => {
    const s = 'release [17713ca1](https://github.com/bahmutov/lazy-ass/commit/17713ca1)'
    const r = replaceLinks(s)
    la(r === 'release 17713ca1', r)
  })
})
