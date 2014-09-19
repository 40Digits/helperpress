/*
 * search-replace-db
 * 
 *
 * Copyright (c) 2014 40Digits Interactive, LLC
 * Licensed under the MIT license.
 */

'use strict';

var execSync = require('execSync'),

  options;


module.exports = function(grunt) {

  grunt.registerMultiTask('search_replace_db', 'Search-Replace-DB Grunt wrapper', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      scriptPath: './vendor/interconnectit/search-replace-db/srdb.cli.php',
      phpPath: 'php',
    });

    var cmd = options.phpPath + ' ' + options.scriptPath,

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

    for(var flag in options){

      if( typeof validFlags[flag] === 'undefined' ){
        continue;
      }

      if( validFlags[flag].type === 'eq-blank' && options[flag].length === 0 ){

          cmd += ' ' + validFlags[flag].blank;

      } else {

        cmd += ' --' + flag;

        if( validFlags[flag].type !== 'empty' ){
            cmd += '=' + grunt.config.process( options[flag] );
        }

      }

    }

    execSync.run(cmd);

  });

};

