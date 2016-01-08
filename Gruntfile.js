'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        '*.js',
        'src/*.js',
        'bin/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    'nice-package': {
      all: {}
    }
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['jshint', 'nice-package']);
};
