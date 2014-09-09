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


	grunt.registerMultiTask('write_helperpress_config', 'Generates config files', function(){

		var options = this.options();

		if(typeof options.type === 'undefined'){
			// see if target name is a valid type
			if(typeof configFileFuncs[this.target] === 'function'){
				options.type = this.target;
			} else {
				return grunt.warn('"write_helperpress_config" requires a "type" setting. None defined in "' + this.target + '" target.');
			}
		}

		var type = options.type;

		if(typeof configFileFuncs[type] !== 'function'){
			return grunt.warn('"write_helperpress_config.type" must be either "repo" or "local".');
		}

		configFileFuncs[type]( grunt.config.process(options.settings) );

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
		var curConfig = fs.existsSync('helperpress.json') ? grunt.file.readJSON('helperpress.json') : {},
			toSave = _.deepExtend(curConfig, newConfig);

		// create helperpress.json
		grunt.file.write( './helperpress.json', prettyJSON(toSave) );

		if( typeof objHasKeys(toSave, [ 'wp', 'theme' ]) !== 'undefined' ){

			// update package.json
			// map write_helperpress_config.repo.wp.theme vals to package.json vals
			var pkgKeyMap = {
					slug: 'name',
					version: 'version',
					description: 'description',
					license: 'license'
				},

				pkgSrc = grunt.file.readJSON('./package.json');

			for( var key in pkgKeyMap ){
				if( typeof toSave.wp.theme[key] !== 'string' || toSave.wp.theme[key].length == 0 ){
					continue;
				}

				pkgSrc[pkgKeyMap[key]] = toSave.wp.theme[key];
			}

			// update package.json
			grunt.file.write( './package.json', prettyJSON(pkgSrc) );

		}

		updatedLoadedConfig(newConfig);
	}

	function local(newConfig){
		var curConfig = fs.existsSync('helperpress.local.json') ? grunt.file.readJSON('helperpress.local.json') : {};

		if( typeof newConfig === 'undefined' ){
			newConfig = {};
		}

		if( typeof newConfig.environments === 'undefined' ){
			newConfig.environments = {};
		}

		if( typeof newConfig.environments.local === 'undefined' ){
			newConfig.environments.local = {};
		}

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

			// setup rewrite or do migration
			switch( newConfig.uploads_sync ) {

				case 'rewrite':
					grunt.task.run('wp_uploads_rewrite:enable');
					break;

				case 'copy':
					grunt.task.run('migrate_uploads:pull:_master');
					break;

			}

		}

		var toSave = _.deepExtend(curConfig, newConfig);

		// write it to the file
		grunt.file.write( 'helperpress.local.json', prettyJSON(toSave) );

		updatedLoadedConfig(newConfig);

	}

}