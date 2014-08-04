module.exports = function (grunt) {

	var gruntConfig = {},

		glob = require('glob'),
		_ = require('lodash'),
		_deepExtend = require('underscore-deep-extend'),
		loadGruntTasks = require('load-grunt-tasks'),
		userhome = require('userhome');

	// initialize _deepExtend into _ object
	_.mixin({deepExtend: _deepExtend(_)});

	



	////////////
	// Aliases
	////////////


	grunt.registerTask( 'setup', [
		'composer:install',
		'gitsubtrees',
		'bower:install',
		'wp_install',
		'symlink'
	]);

	grunt.registerTask('update', 'Update all the things.', function(){

		// prompt checklist of things to update

		// update composer

		// update WP core

		// update WP plugins

		// migrate DB down

	});

	grunt.registerTask('default', ['watch']); // TODO: this should be a main menu prompt








	/////////////////////////////
	// Load site/package config
	/////////////////////////////

	var packageJSON = grunt.file.readJSON('package.json'),
		userDefaultsJSON = grunt.file.exists( userhome('.wpe_defaults') ) ? grunt.file.readJSON( userhome('.wpe_defaults') ) : {},
		siteConfigJSON = grunt.file.exists('site_config.json') ? grunt.file.readJSON('site_config.json') : {},
		siteConfigLocalJSON = grunt.file.exists('site_config.json.local') ? grunt.file.readJSON('site_config.json.local') : {};
	
	// wrap config objects for extending
	var wrappedUserDefaultsJSON = { config: userDefaultsJSON },
		wrappedSiteConfigJSON = { config: siteConfigJSON },
		wrappedSiteConfigLocalJSON = { config: siteConfigLocalJSON };

	// combine all config files
	gruntConfig.pkg = _.deepExtend( packageJSON, wrappedUserDefaultsJSON, wrappedSiteConfigJSON, wrappedSiteConfigLocalJSON );







	//////////////////////
	// Load Task configs
	//////////////////////

	var configPath = './grunt/configs/';
	glob.sync('**/*.js', {cwd: configPath}).forEach(function(option) {

		// remove .js extension
		var key = option.replace(/\.js$/,'');

		// remove any directories
		key = key.substr( key.lastIndexOf('/') + 1 );
		
		gruntConfig[key] = require(configPath + option);

	});








	////////////////
	// kick it off
	////////////////

	// load Grunt tasks defined in package.json
	loadGruntTasks(grunt);

	// load Grunt tasks in ./grunt/tasks directory
	var configPath = './grunt/tasks/';
	glob.sync('**/*.js', {cwd: configPath}).forEach(function(option) {

		var task = require(configPath + option);

		if(typeof task === 'function')
			task(grunt);

	});


	// initialize config
	grunt.initConfig(gruntConfig);


};