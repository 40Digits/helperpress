var _ = require('lodash'),
	_deepExtend = require('underscore-deep-extend'),
	fs = require('fs'),
	
	grunt,
	options = {};
	
// initialize _deepExtend into _ object
_.mixin({deepExtend: _deepExtend(_)});



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

	var curPkg = grunt.config('pkg.config'),
		pkgExtended = _.deepExtend(curPkg, newConfig);


	grunt.config('pkg.config', pkgExtended);
}



// down to bidness
////////////////////

function repo(options){

	var newContents = grunt.config('setup_site_config.repo');

	// use theme slug as database name, too
	grunt.config('pkg.config.environments.local.db.database', newContents.wp.theme.slug);

	// create the file
	grunt.file.write( './site_config.json', prettyJSON(newContents) );

	updatedLoadedConfig(newContents);

};

function local(options){
	var localEnv = {},
		curContents = fs.existsSync('site_config.local.json') ? grunt.file.readJSON('site_config.local.json') : {};


	// Local Database
	var wpSlug = grunt.config('pkg.config.wp.theme.slug');

	if( typeof objHasKeys(options, [ 'db', 'database' ]) !== 'undefined' ) {
		localEnv.database = options.db.database;
	} else if( wpSlug.length > 0 && typeof objHasKeys(curContents, [ 'environments', 'local', 'database' ]) === 'undefined' ) {

		// if we have a wp slug and there is no currently configured db, use that.
		localEnv.database = wpSlug;

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
		localEnv.home_url = grunt.config('pkg.config.apache.url_scheme').replace('*', wpSlug);

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


module.exports = function(gruntObj) {

	grunt = gruntObj;

	var configs = {
		repo: repo,
		local: local
	};

	grunt.registerMultiTask('setup_site_config', 'Generates config files', function(){

		if(typeof configs[this.target] !== 'function')
			return grunt.warn('"setup_site_config" only handles specific targets ("repo" and "local")');

		options[this.target] = this.data;

		configs[this.target]( grunt.config.process(this.data) );

	});

}