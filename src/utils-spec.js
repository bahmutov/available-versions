const snapshot = require('snap-shot-it')

/* global describe, it */
describe('tagsByVersion', () => {
  const tagsByVersion = require('./utils').tagsByVersion

  it('supports different tags', () => {
    const separate = {
      latest: '2.0.0',
      dev: '2.1.0'
    }
    const same = {
      latest: '2.1.0',
      dev: '2.1.0'
    }
    snapshot(tagsByVersion, separate, same)
  })
})
