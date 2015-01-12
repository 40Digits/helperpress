module.exports = function (grunt) {

	var gruntConfig = {},

		glob = require('glob'),
		_ = require('lodash'),
		_deepExtend = require('underscore-deep-extend'),
		loadGruntTasks = require('smartload-grunt-tasks'),
		userhome = require('userhome');

	// initialize _deepExtend into _ object
	_.mixin({deepExtend: _deepExtend(_)});




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


	// use our own logging so we can make Grunt less verbose
	grunt = require('./grunt/lib/custom-logger.js')(grunt);


	////////////////
	// kick it off
	////////////////

	loadGruntTasks(grunt, {
		dir: 'grunt/tasks/',
		pkgScope: grunt.option('no_dev_deps') ? 'dependencies' : ['dependencies', 'devDependencies'],
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