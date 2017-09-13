'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    'nice-package': {
      all: {}
    }
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['nice-package']);
};
