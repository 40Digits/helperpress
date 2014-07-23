/*
 * grunt-wp-cli
 * 
 *
 * Copyright (c) 2014 40Digits Interactive, LLC
 * Licensed under the MIT license.
 */

'use strict';

var execSync = require('execSync'),
  _ = require('lodash'),

  options;


// Core

function coreDownload(wpPath){
  var cmd = options.cmdPath + ' core download';

  if(typeof wpPath !== 'undefined')
    cmd += ' --path=' + wpPath;

  execSync.run(cmd);
}

function coreConfig(flags){
  var cmd = options.cmdPath + ' core config',
    validFlags = [
      'dbname',
      'dbuser',
      'dbpass',
      'dbhost',
      'dbprefix',
      'dbcharset',
      'dbcollate',
      'locale',
      'extra-php',
      'skip-salts',
      'skip-check'
    ];

  flags.forEach(function(el, i){

    if( _.indexOf(validFlags, i) === -1 )
      return grunt.warn('"' + i + '" is not a valid "wp core config" flag');

    cmd += ' --' + i + '=' + el;

  });

  execSync.run(cmd);
}

// DB

function dbCreate(){
  var cmd = options.cmdPath + ' db create';

  execSync.run(cmd);
  
}

// Plugins

function pluginInstall(plugin, activate){
  var cmd = options.cmdPath + ' plugin install';

  if(typeof plugin === 'undefined')
    return grunt.warn('No plugin specified.');

  cmd += ' ' + plugin;

  if(activate)
    cmd += ' --activate';

  execSync.run(cmd);

}

function pluginActivate(plugin){
  var cmd = options.cmdPath + ' plugin activate';

  if(typeof plugin === 'undefined')
    return grunt.warn('No plugin specified.');

  cmd += ' ' + plugin;

  if(activate)
    cmd += ' --activate';

  execSync.run(cmd);

}

function pluginBatchInstall(plugins){
  plugins.forEach(function(el){
    pluginInstall(el);
  });
}

module.exports = function(grunt) {

  var wp = {
    install_core: coreDownload,
    core_config: coreConfig,
    db_create: dbCreate,
    install_plugins: pluginBatchInstall
  };

  grunt.registerMultiTask('wp_cli', 'WP CLI grunt wrapper', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      cmdPath: 'wp'
    });


    if(typeof wp[this.target] !== 'function')
      return grunt.warn('"' + this.target + '" is not a valid wp-cli task.');

    wp[this.target](this.data);

  });

};
