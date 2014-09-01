var _ = require('lodash'),
	_deepExtend = require('underscore-deep-extend'),
	fs = require('fs');
	
// initialize _deepExtend into _ object
_.mixin({deepExtend: _deepExtend(_)});


module.exports = function(grunt) {

	var configFileFuncs = {
		repo: repo,
		local: local
	};

	// setup these default configs so the defaults for each config file can be run
	grunt.config('write_site_config.local', {});
	grunt.config('write_site_config.repo', {});

	grunt.registerMultiTask('write_site_config', 'Generates config files', function(){

		if(typeof this.data.type === 'undefined'){
			// see if target name is a valid type
			if(typeof configFileFuncs[this.target] === 'function'){
				this.data.type = this.target;
			} else {
				return grunt.warn('"write_site_config" requires a "type" setting. None defined in "' + this.target + '" target.');
			}
		}

		var type = this.data.type;

		if(typeof configFileFuncs[type] !== 'function'){
			return grunt.warn('"write_site_config.type" must be either "repo" or "local".');
		}

		configFileFuncs[type].apply( this, grunt.config.process(this.data.settings) );

	});


	// util funcs
	///////////////

	function prettyJSON(val){
		return JSON.stringify(val, null, 2);
	}

	function objHasKeys(obj, keys) {
		var next = keys.shift();
		return obj[next] && (! keys.length || objHasKeys(obj[next], keys));
	}

	function updatedLoadedConfig(newConfig){

		var hpConfig = grunt.config('helperpress'),
			hpConfigExtended = _.deepExtend(hpConfig, newConfig);


		grunt.config('helperpress', hpConfigExtended);
	}



	// down to bidness
	////////////////////

	function repo(newConfig){
		var curConfig = fs.existsSync('site_config.json') ? grunt.file.readJSON('site_config.json') : {};
		
		if( typeof newConfig === 'undefined' ){
			newConfig = {};
		}

		var toSave = _.deepExtend(curConfig, newConfig);

		// create site_config.json
		grunt.file.write( './site_config.json', prettyJSON(toSave) );

		// update package.json
		// map write_site_config.repo.wp.theme vals to package.json vals
		var pkgKeyMap = {
				slug: 'name',
				version: 'version',
				description: 'description',
				license: 'license'
			},

			pkgSrc = grunt.file.readJSON('./package.json');

		for( var key in pkgKeyMap ){
			if( typeof newConfigContents.wp.theme[key] !== 'string' || newConfigContents.wp.theme[key].length > 0 ){
				continue;
			}

			pkgSrc[pkgKeyMap[key]] = newConfigContents.wp.theme[key];
		}

		// update package.json
		grunt.file.write( './package.json', prettyJSON(pkgSrc) );

		updatedLoadedConfig(newConfigContents);
	}

	function local(newConfig){
		var curConfig = fs.existsSync('site_config.local.json') ? grunt.file.readJSON('site_config.local.json') : {};

		if( typeof newConfig === 'undefined')
			newConfig = {};

		// Intelligently set defaults
		//////////////////////////////

		// Local Database
		var wpSlug = grunt.config('helperpress.wp.theme.slug');

		if( wpSlug.length > 0 && typeof objHasKeys(curConfig, [ 'environments', 'local', 'database' ]) === 'undefined' ) {

			// if we have a wp slug and there is no currently configured db, use that.
			newConfig.environments.local.db = {
				database: wpSlug
			};

		}
		

		// Local wp_path
		if( typeof curConfig.wp_path === 'undefined' ){

			// let's infer it... probably CWD
			newConfig.environments.local.wp_path = process.cwd() + '/' + grunt.config('helperpress.build_dir');

		}
			

		// Local home_url
		if( typeof curConfig.home_url === 'undefined' ){

			// let's infer it based on apache config
			newConfig.environments.local.home_url = grunt.config('helperpress.apache.url_scheme').replace('*', wpSlug);

		}

		// uploads_sync
		if( typeof newConfig.uploads_sync === 'undefined' && typeof curConfig.uploads_sync === 'undefined' ){

			var curUploadsConf = grunt.config('helperpress.uploads_sync');
			if( typeof curUploadsConf === 'string' && curUploadsConf.length > 0 ){
				
				// if it's set elsewhere (likely ~/.helperpress) then save that within repo
				newConfig.uploads_sync = curUploadsConf;

			} else {

				// default to rewrite
				newConfig.uploads_sync = 'rewrite';

			}

		}

		var toSave = _.deepExtend(curConfig, newConfig);

		// write it to the file
		grunt.file.write( 'site_config.local.json', prettyJSON(toSave) );

		updatedLoadedConfig(newConfigContents);

	}

}