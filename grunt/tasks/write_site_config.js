var _ = require('lodash'),
	_deepExtend = require('underscore-deep-extend'),
	fs = require('fs'),
	
	options = {};
	
// initialize _deepExtend into _ object
_.mixin({deepExtend: _deepExtend(_)});


module.exports = function(grunt) {

	var configs = {
		repo: repo,
		local: local
	};

	grunt.registerMultiTask('write_site_config', 'Generates config files', function(){

		if(typeof configs[this.target] !== 'function')
			return grunt.warn('"write_site_config" only handles specific targets ("repo" and "local")');

		options[this.target] = this.data;

		configs[this.target]( grunt.config.process(this.data) );

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

	function repo(options){
		var newContents = grunt.config('write_site_config.repo');

		// create site_config.json
		grunt.file.write( './site_config.json', prettyJSON(newContents) );

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
			if( typeof newContents.wp.theme[key] !== "string" || newContents.wp.theme[key].length > 0 ){
				continue;
			}

			pkgSrc[pkgKeyMap[key]] = newContents.wp.theme[key];
		}

		// update package.json
		grunt.file.write( './package.json', prettyJSON(pkgSrc) );


		updatedLoadedConfig(newContents);
	};

	function local(options){
		var localEnv = {},
			curContents = fs.existsSync('site_config.local.json') ? grunt.file.readJSON('site_config.local.json') : {};


		// Local Database
		var wpSlug = grunt.config('helperpress.wp.theme.slug');

		if( typeof objHasKeys(options, [ 'db', 'database' ]) !== 'undefined' ) {

			localEnv.database = options.db.database;

		} else if( wpSlug.length > 0 && typeof objHasKeys(curContents, [ 'environments', 'local', 'database' ]) === 'undefined' ) {

			// if we have a wp slug and there is no currently configured db, use that.
			localEnv.db = {
				database: wpSlug
			};

		}
		

		// Local wp_path
		if( typeof options.wp_path !== 'undefined' ){

			localEnv.wp_path = options.wp_path;

		} else {

			// let's infer it... probably CWD
			localEnv.wp_path = process.cwd() + '/www';

		}
			

		// Local home_url
		if( typeof options.home_url !== 'undefined' ){

			localEnv.home_url = options.home_url;

		} else {

			// let's infer it
			localEnv.home_url = grunt.config('helperpress.apache.url_scheme').replace('*', wpSlug);

		}

		// uploads_sync
		var curUploadsConf = grunt.config('helperpress.environments.local.uploads_sync');
		if( typeof options.uploads_sync !== 'undefined' ){

			localEnv.uploads_sync = options.uploads_sync;

		} else if(typeof curUploadsConf === 'string' && curUploadsConf.length > 0){
			
			// if it's set elsewhere (likely ~/.helperpress) then save that within repo
			localEnv.uploads_sync = curUploadsConf;

		} else {

			// default to rsync
			localEnv.uploads_sync = 'rsync';

		}


		var newContents = {
			'environments': {
				'local': localEnv
			}
		};

		var toSave = _.deepExtend(curContents, newContents);

		// write it to the file
		grunt.file.write( 'site_config.local.json', prettyJSON(toSave) );

		updatedLoadedConfig(newContents);

	}

}