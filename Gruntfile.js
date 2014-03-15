'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        '*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
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
