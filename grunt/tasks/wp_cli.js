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

  options,
  grunt;


// Core

function coreDownload(){
  var cmd = options.cmdPath + ' core download --path=' + options.wpPath;

  execSync.run(cmd);
}

function coreUpdate(){
  var cmd = options.cmdPath + ' core update --path=' + options.wpPath;

  execSync.run(cmd);

  coreUpdateDb();
}

function coreUpdateDb(){
  var cmd = options.cmdPath + ' core update-db --path=' + options.wpPath;

  execSync.run(cmd);
}

function coreInstall(flags){
  var cmd = options.cmdPath + ' core install --path=' + options.wpPath,
    validFlags = [
      'url',
      'title',
      'admin_user',
      'admin_password',
      'admin_email'
    ],

    flagVal;

  for(var el in flags){

    if( _.indexOf(validFlags, el) === -1 ){
      return grunt.warn('"' + el + '" is not a valid "wp core install" flag');
    }

    flagVal = grunt.config.process(flags[el]);

    if( flagVal.length > 0){
      cmd += ' --' + el + '="' + flagVal.replace(/"/g, "") + '"';
    }

  }

  execSync.run(cmd);

}

// TODO; DRYify these two functions above and below

function coreConfig(flags){
  var cmd = options.cmdPath + ' core config --path=' + options.wpPath,
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
    ],

    flagVal;

  for(var el in flags){

    if( _.indexOf(validFlags, el) === -1 )
      return grunt.warn('"' + el + '" is not a valid "wp core config" flag');

    flagVal = grunt.config.process(flags[el]);

    if( flagVal.length > 0)
      cmd += ' --' + el + '=' + flagVal;

  }

  execSync.run(cmd);
}

// DB

function dbCreate(){
  var cmd = options.cmdPath + ' db create --path=' + options.wpPath;

  execSync.run(cmd);
  
}

// Rewrites

function rewriteFlush(){
  var cmd = options.cmdPath + ' rewrite flush --hard --path=' + options.wpPath;

  execSync.run(cmd);
  
}

// Plugins

function pluginInstall(plugin, activate){
  var cmd = options.cmdPath + ' plugin install --path=' + options.wpPath;

  if(typeof plugin === 'undefined')
    return grunt.warn('No plugin specified.');

  cmd += ' ' + plugin;

  if(activate)
    cmd += ' --activate';

  execSync.run(cmd);

}

function pluginUninstall(plugin){
  var cmd = options.cmdPath + ' plugin uninstall --path=' + options.wpPath;

  if(typeof plugin === 'undefined')
    return grunt.warn('No plugin specified.');

  cmd += ' ' + plugin;

  execSync.run(cmd);

}

function pluginActivate(plugin){
  var cmd = options.cmdPath + ' plugin activate --path=' + options.wpPath;

  if(typeof plugin === 'undefined')
    return grunt.warn('No plugin specified.');

  cmd += ' ' + plugin;

  execSync.run(cmd);

}


function pluginUpdateAll(){
  var cmd = options.cmdPath + ' plugin update --all --path=' + options.wpPath;

  execSync.run(cmd);
}

function pluginBatchInstall(plugins){
  plugins.forEach(function(el){
    pluginInstall(el);
  });
}

function pluginBatchUninstall(plugins){
  plugins.forEach(function(el){
    pluginUninstall(el);
  });
}

module.exports = function(gruntObj) {

  grunt = gruntObj;

  var wp = {
    download_core: coreDownload,
    update_core: coreUpdate,
    install_core: coreInstall,
    core_config: coreConfig,
    db_create: dbCreate,
    rewrite_flush: rewriteFlush,
    install_plugins: pluginBatchInstall,
    update_all_plugins: pluginUpdateAll,
    remove_plugins: pluginBatchUninstall
  };

  grunt.registerMultiTask('wp_cli', 'WP CLI grunt wrapper', function() {

    options = this.options({
      cmdPath: 'wp',
      wpPath: './'
    });


    if(typeof wp[this.target] !== 'function')
      return grunt.warn('"' + this.target + '" is not a valid wp-cli command.');

    wp[this.target]( grunt.config.process(this.data) );

  });

};
