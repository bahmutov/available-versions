'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')

function hasVersionSeparator (s) {
  return s.indexOf('@', 1) > 0
}

function isScopedName (s) {
  return /^@/.test(s)
}

function splitVersion (name, version) {
  la(is.unemptyString(name), 'missing string', name)

  if (hasVersionSeparator(name) && !version) {
    let parts = name.split('@')
    if (isScopedName(name)) {
      name = '@' + parts[1]
      version = parts[2]
    } else {
      name = parts[0]
      version = parts[1]
    }
  }

  return {
    name: name,
    version: version
  }
}

module.exports = splitVersion
