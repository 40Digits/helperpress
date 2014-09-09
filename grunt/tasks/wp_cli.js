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


module.exports = function(grunt) {

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


  // Run a WP-CLI command
  function runCmd(args){
   var result = execSync.exec(options.cmdPath + ' ' + args + ' --path=' + options.wpPath);
   
   if(result.code === 0){
    grunt.log.ok(result.stdout)
   }else{
    grunt.fatal(result.stdout)
   }
  }


  // Core

  function coreDownload(){
    var cmd = 'core download';

    runCmd(cmd);
  }

  function coreUpdate(){
    var cmd = 'core update';

    runCmd(cmd);

    coreUpdateDb();
  }

  function coreUpdateDb(){
    var cmd = 'core update-db';

    runCmd(cmd);
  }

  function coreInstall(flags){
    var cmd = 'core install',
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

    runCmd(cmd);

  }

  // TODO; DRYify these two functions above and below

  function coreConfig(flags){
    var cmd = 'core config',
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

    runCmd(cmd);
  }

  // DB

  function dbCreate(){
    var cmd = 'db create';

    runCmd(cmd);
    
  }

  // Rewrites

  function rewriteFlush(){
    var cmd = 'rewrite flush --hard';

    runCmd(cmd);
    
  }

  // Plugins

  function pluginInstall(plugin, activate){
    var cmd = 'plugin install';

    if(typeof plugin === 'undefined')
      return grunt.warn('No plugin specified.');

    cmd += ' ' + plugin;

    if(activate)
      cmd += ' --activate';

    runCmd(cmd);

  }

  function pluginUninstall(plugin){
    var cmd = 'plugin uninstall';

    if(typeof plugin === 'undefined')
      return grunt.warn('No plugin specified.');

    cmd += ' ' + plugin;

    runCmd(cmd);

  }

  function pluginActivate(plugin){
    var cmd = 'plugin activate';

    if(typeof plugin === 'undefined')
      return grunt.warn('No plugin specified.');

    cmd += ' ' + plugin;

    runCmd(cmd);

  }


  function pluginUpdateAll(){
    var cmd = 'plugin update --all';

    runCmd(cmd);
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

  grunt.registerMultiTask('wp_cli', 'WP CLI grunt wrapper', function() {

    options = this.options({
      cmdPath: 'wp',
      wpPath: './'
    });


    if(typeof wp[this.target] !== 'function')
      grunt.warn('"' + this.target + '" is not a valid wp-cli command.');

    wp[this.target]( grunt.config.process(this.data) );

  });

};
