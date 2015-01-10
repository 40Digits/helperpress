module.exports = function (grunt) {

	var gruntConfig = {},

		glob = require('glob'),
		_ = require('lodash'),
		_deepExtend = require('underscore-deep-extend'),
		loadGruntTasks = require('smartload-grunt-tasks'),
		userhome = require('userhome');

	// initialize _deepExtend into _ object
	_.mixin({deepExtend: _deepExtend(_)});





	////////////
	// Aliases
	////////////

	// run this task first after forking
	grunt.registerTask( 'init_project', [

		// interactively setup this repo
		'prompt:repo_config',
		'write_helperpress_config:repo_config',
		'gitaddcommit:helperpress_config_init',

		// add WP theme definition banner to stylesheet
		'wp_stylesheet_theme_info',
		'gitaddcommit:stylesheet_init'

	]);


	// run this task to setup things for local development
	grunt.registerTask( 'build_dev', [

		'prompt:sudo_pass', // needed for apache_config

		// clean previous build
		'clean:build_dir',

		// install packages
		'composer:install',

		// Get WP files
		'wp_cli:download_core',

		// setup local config
		'write_helperpress_config:local',

		// note that we haven't finished first build yet
		'write_build_dev_incomplete:true',

		// Install WP
		'wp_cli:core_config',
		'wp_cli:db_create',
		'wp_default_user_creds',
		'wp_cli:install_core',
		'wp_cli:install_plugins',
		'symlink:custom_plugins',
		'symlink:hp_plugins',

		// symlink wp-theme into WP installation
		'symlink:theme',

		// wrap up WP-CLI stuff
		'wp_cli:remove_plugins',
		'clean:wp_default_themes',

		// config apache
		'apache_config',

		// pull DB and files from db_master
		'pull:db:_master',
		'wp_cli:rewrite_flush',

		// note that we finished first build
		'write_build_dev_incomplete:false'

	]);

	// run this task to setup everything for distribution
	grunt.registerTask( 'build_dist', [

		// clean previous build
		'clean:build_dir',

		// install packages
		'composer:install',

		// Get WP files
		'wp_cli:download_core',

		// setup local config
		'write_helperpress_config:local',

		// Install WP
		'wp_cli:core_config',
		'wp_cli:db_create',
		'wp_cli:install_core',
		'wp_cli:install_plugins',
		'copy:custom_plugins',
		'copy:hp_plugins',

		// build assets
		'shell:build_dist_assets',

		// copy theme into build dir
		'copy:theme',

		// wrap up WP-CLI stuff
		'wp_cli:remove_plugins',
		'wp_cli:rewrite_flush',
		'clean:wp_default_themes',

		// clean copied theme
		'clean:non_dist'

	]);




	// default task is defined in ./grunt/tasks dir





	/////////////////////////////
	// Load site/package config
	/////////////////////////////
	
	var projectDir = grunt.option('projectdir');

	var HpPackageJSON = grunt.file.readJSON('./package.json'),
		packageJSON = grunt.file.exists( projectDir + '/package.json' ) ? grunt.file.readJSON(projectDir + '/package.json') : {},
		userDefaultsJSON = grunt.file.exists( userhome('.helperpress') ) ? grunt.file.readJSON( userhome('.helperpress') ) : {},
		siteConfigJSON = grunt.file.exists(projectDir + '/helperpress.json') ? grunt.file.readJSON(projectDir + '/helperpress.json') : {},
		siteConfigLocalJSON = grunt.file.exists(projectDir + '/helperpress.local.json') ? grunt.file.readJSON(projectDir + '/helperpress.local.json') : {};

	// combine all config files
	gruntConfig.helperpress = _.deepExtend(
		HpPackageJSON.config,
		typeof(packageJSON.config) !== 'undefined' ? packageJSON.config : {},
		userDefaultsJSON,
		siteConfigJSON,
		siteConfigLocalJSON
	);

	gruntConfig.pkg = packageJSON;
	grunt.package = HpPackageJSON;






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

	// if this environment is one of the deployment environments (ie, not a dev's local machine),
	// then set "local" env to the same JSON object as defined env
	if( typeof gruntConfig.helperpress.alias_local_env === 'string' ){

		// make sure that environment is actually defined
		if( typeof gruntConfig.helperpress.environments[gruntConfig.helperpress.alias_local_env] === undefined ){
			grunt.warn('No configuration defined for "' + gruntConfig.helperpress.alias_local_env + '" environment. Cannot set local environment as alias.');
		}

		grunt.log.ok('Merging "local" environment config with "' + gruntConfig.helperpress.alias_local_env + '" config.');
		gruntConfig.helperpress.environments.local = _.deepExtend( gruntConfig.helperpress.environments[gruntConfig.helperpress.alias_local_env], gruntConfig.helperpress.environments.local );

	}

	if(typeof gruntConfig.helperpress.environments !== 'undefined'){
		// set ftp_wp_path if not defined
		// TODO - this should be moved into a more robust, complete defaults generator
		for(var env in gruntConfig.helperpress.environments){
			if(typeof gruntConfig.helperpress.environments[env].ftp_wp_path === 'undefined' && typeof gruntConfig.helperpress.environments[env].wp_path === 'string'){
				gruntConfig.helperpress.environments[env].ftp_wp_path = gruntConfig.helperpress.environments[env].wp_path;
			}
		}
	}




	// TODO: check confs and permissions
	//	- not running as root
	//	- write perms on all conf dirs
	//	- ~/.helperpress created
	//	- required configs set: apache, local db




	////////////////
	// kick it off
	////////////////

	loadGruntTasks(grunt, {
		dir: 'grunt/tasks/',
		pkgScope: 'dependencies',
		smartLoad: {
			'sass:dev': ['grunt-contrib-sass'],
			'autoprefixer:sass': ['grunt-autoprefixer'],
			'newer:imagemin:assets_dev': ['grunt-newer', 'grunt-contrib-imagemin'],
			'browserifyBower': ['grunt-browserify-bower'],
			'browserify:dev': ['grunt-browserify']
		}
	});

	// initialize config
	grunt.initConfig(gruntConfig);


};