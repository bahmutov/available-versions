const available = require('../..')
const la = require('lazy-ass')

/* eslint-env mocha */
it('deps-ok', function () {
  la(available.length === 2)
  return available({
    name: 'deps-ok'
  }).then(function (info) {
    la(info.name === 'deps-ok')
  })
})

it('deps-ok with version', function () {
  return available({
    name: 'deps-ok',
    version: '1.0.0'
  }).then(function (info) {
    la(info.name === 'deps-ok')
  })
})

it('@bahmutov/csv with scope', function () {
  return available({
    name: '@bahmutov/csv'
  }).then(function (info) {
    la(info.name === '@bahmutov/csv')
  })
})

la('deps-ok as string', function () {
  return available('deps-ok')
  .then(function (info) {
    la(info.name === 'deps-ok')
  })
})
