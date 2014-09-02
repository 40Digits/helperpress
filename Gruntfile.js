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

	// run this task first after forking
	grunt.registerTask( 'init_project', [	

		// initialize subtrees
		'gitsubtrees',	

		// interactively setup this repo 
		'prompt:repo_config',
		'write_site_config:repo_config',
		'gitaddcommit:site_config_init',

		// add WP theme definition banner to stylesheet
		'wp_stylesheet_theme_info',
		'gitaddcommit:stylesheet_init'

	]);


	// run this task to setup things for local development
	grunt.registerTask( 'build_dev', [

		'prompt:sudo_pass', // needed for apache_config

		// install packages
		'composer:install',
		'bower:install',

		// setup local config
		'write_site_config:local',

		// WordPress goodness
		'wp_cli:download_core',
		'wp_cli:core_config',
		'wp_cli:db_create',
		'wp_cli:install_core',
		'wp_cli:install_plugins',
		'wp_cli:remove_plugins',
		'wp_cli:rewrite_flush',
		'clean:wp_default_themes',

		// symlink wp-theme into WP installation
		'symlink:theme',

		// config apache
		'apache_config',

		// pull DB and files from db_master
		'migrate_db:pull:_master',

		// watch, because we're good to go!
		'watch'

	]);

	// run this task to setup everything for distribution
	grunt.registerTask( 'build_dist', [

		// install packages
		'composer:install',
		'bower:install',

		'write_site_config:local',

		// WordPress goodness
		'wp_cli:download_core',
		'wp_cli:core_config',
		'wp_cli:db_create',
		'wp_cli:install_core',
		'wp_cli:install_plugins',
		'wp_cli:remove_plugins',
		'wp_cli:rewrite_flush',
		'clean:wp_default_themes',

		// build assets
		'build_dist_assets',

		// copy theme into build dir
		'copy:theme',

		// clean copied theme
		'clean:non_dist'

	]);

	grunt.registerTask( 'build_dist_assets', [

		// CSS
		'sass:dist',
		'cmq:sass',
		'autoprefixer:cmq',

		// JS
		'browserifyBower',
		'browserify',
		'concat:browserify_dist',
		'uglify:browserify',

		// Images
		'newer:imagemin:assets_dist'
	]);




	// default task is defined in ./grunt/tasks dir





	/////////////////////////////
	// Load site/package config
	/////////////////////////////

	var packageJSON = grunt.file.readJSON('package.json'),
		userDefaultsJSON = grunt.file.exists( userhome('.helperpress') ) ? grunt.file.readJSON( userhome('.helperpress') ) : {},
		siteConfigJSON = grunt.file.exists('site_config.json') ? grunt.file.readJSON('site_config.json') : {},
		siteConfigLocalJSON = grunt.file.exists('site_config.local.json') ? grunt.file.readJSON('site_config.local.json') : {};

	// combine all config files
	gruntConfig.helperpress = _.deepExtend( packageJSON.config, userDefaultsJSON, siteConfigJSON, siteConfigLocalJSON );
	gruntConfig.pkg = packageJSON;






	//////////////////////
	// Load Task configs
	//////////////////////

	var configPath = './grunt/configs/';
	glob.sync('**/*.js', {cwd: configPath}).forEach(function(option) {

		// remove .js extension
		var key = option.replace(/\.js$/,''),
			configExports;

		// remove any directories
		key = key.substr( key.lastIndexOf('/') + 1 );
		
		configExports = require(configPath + option);

		if(typeof configExports === 'function'){
			gruntConfig[key] = configExports(grunt);
		}else{
			gruntConfig[key] = configExports;
		}

	});






	// TODO: check confs and permissions
	//	- not running as root
	//	- write perms on all conf dirs 
	//	- ~/.helperpress created
	//	- required configs set: apache, local db





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