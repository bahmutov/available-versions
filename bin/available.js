#!/usr/bin/env node

'use strict'

const help = [
  'USE: vers <module name> [start version]',
  '    "vers chalk"',
  '    "vers chalk 0.3.0"'
].join('\n')

const join = require('path').join
const available = require('..')

require('simple-bin-help')({
  minArguments: 3,
  packagePath: join(__dirname, '..', 'package.json'),
  help: help
})

const packageName = process.argv[2]
const packageVersion = process.argv[3]
const options = require('../src/split-version')(packageName, packageVersion)

const hideDebugOutput = true

const fetchReleaseNotes = require('../src/fetch-release-notes')

const printReleases = require('../src/print-releases')
const print = printReleases.bind(null, options)

available(options, hideDebugOutput)
  .then(fetchReleaseNotes)
  .then(print)
  .catch(function (err) {
    if (err.message === 'Not found') {
      console.error('Cannot find NPM module "%s"', packageName)
      console.error('Please check module name spelling')
    } else {
      console.error('available versions error')
      console.error(err)
    }
  })
