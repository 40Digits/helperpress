/*
 * search-replace-db
 * 
 *
 * Copyright (c) 2014 40Digits Interactive, LLC
 * Licensed under the MIT license.
 */

'use strict';

var execSync = require('execSync'),
  _ = require('lodash'),

  options;


module.exports = function(grunt) {

  grunt.registerMultiTask('search_replace_db', 'Search-Replace-DB Grunt wrapper', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      scriptPath: './vendor/interconnectit/search-replace-db/srdb.cli.php',
      phpPath: 'php',
      globalFlags: {}
    });

    var cmd = options.phpPath + ' ' + options.scriptPath,

      // allow global flags to be set via options
      extendedFlags = _.extend(options.globalFlags, this.data),

      // the script's expected flags
      validFlags = {
        'host': {
          type: 'eq'
        },
        'name': {
          type: 'eq'
        },
        'user': {
          type: 'eq'
        },
        'pass': {
          type: 'eq-blank',
          blank: '-p ""'
        },
        'search': {
          type: 'eq'
        },
        'replace': {
          type: 'eq'
        },
        'tables': {
          type: 'eq'
        },
        'include-cols': {
          type: 'eq'
        },
        'exclude-cols': {
          type: 'eq'
        },
        'regex': {
          type: 'empty'
        },
        'pagesize': {
          type: 'eq'
        },
        'dry-run': {
          type: 'empty'
        },
        'alter-engine': {
          type: 'eq'
        },
        'alter-collation': {
          type: 'eq'
        },
        'verbose': {
          type: 'eq'
        },
      };

    for(var flag in extendedFlags){

      if( typeof extendedFlags[flag] === 'undefined' ){
        grunt.warn('"' + flag + '" is not a valid "search-replace-db" flag');
        continue;
      }

      if( validFlags[flag].type === 'eq-blank' ){

        cmd += ' ' + validFlags[flag].blank;

      } else {

        cmd += ' --' + flag;

        if( validFlags[flag].type === 'eq' ){
            cmd += '=' + grunt.config.process( extendedFlags[flag] );
        };

      }

    }

    execSync.run(cmd);

  });

};

