var _ = require('lodash'),
	_deepExtend = require('underscore-deep-extend'),
	grunt;
	
// initialize _deepExtend into _ object
_.mixin({deepExtend: _deepExtend(_)});

function prettyJSON(val){
	return JSON.stringify(val, null, 2);
}

function updatedLoadedConfig(newConfig){

	var curPkg = grunt.config('pkg.config'),
		pkgExtended = _.deepExtend(curPkg, newConfig);


	grunt.config('pkg.config', curPkg);
}


function repo(options){

	var newContents = grunt.config('setup_site_config.repo');

	// create the file
	grunt.file.write( './site_config.json', prettyJSON(newContents) );

	updatedLoadedConfig(newContents);

};

function local(options){
	var localEnv = {},
		curContents = grunt.file.isMatch('site_config.local.json') ? grunt.file.readJSON('site_config.local.json') : {};


	// Local Database
	var wpSlug = grunt.config('pkg.config.wp.theme.slug');

	if( typeof options.db.database !== 'undefined' ) {
		localEnv.database = options.db.database;
	} else if( wpSlug.length > 0 && typeof curContents.environments.local.database === 'undefined' ) {

		// if we have a wp slug and there is no currently configured db, use that.
		localEnv.database = wpSlug;

	}
	

	// Local wp_path
	if( typeof options.wp_path !== 'undefined' ){
		localEnv.wp_path = options.wp_path;
	} else {

		// let's infer it... probably CWD
		localEnv.wp_path = process.cwd();

	}
		

	// Local home_url
	if( typeof options.home_url !== 'undefined' ){
		localEnv.home_url = optoins.home_url;
	} else {

		// let's infer it
		localEnv.home_url = '//' + grunt.config('pkg.config.apache.url_scheme').replace('*', options.site_slug);

	}


	var newContents = {
		'environments': {
			'local': localEnv
		}
	};

	var toSave = _.deepExtend(curContents, newContents);

	grunt.file.write( 'site_config.local.json', prettyJSON(toSave) );

}


module.exports = function(gruntObj) {

	grunt = gruntObj;

	var configs = {
		repo: repo,
		local: local
	};

	grunt.registerMultiTask('setup_site_config', 'Generates config files', function(){
		var options = this.options();

		if(typeof configs[this.target] !== 'function')
			return grunt.warn('"setup_site_config" only handles specific targets ("repo" and "local")');


	});

}