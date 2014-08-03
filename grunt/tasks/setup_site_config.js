var _ = require('lodash'),
	_deepExtend = require('underscore-deep-extend');
	
	// initialize _deepExtend into _ object
	_.mixin({deepExtend: _deepExtend(_)});

function prettyJSON(val){
	return JSON.stringify(val, null, 2)
}


module.exports = function(grunt) {

	grunt.registerTask('setup_site_config', 'Generates config files', function(type){

		var newContents,
			curContents;

		switch(type){

			case 'repo':
				newContents = grunt.config('prompt_setup_repo');

				// create the file
				grunt.file.write( './site_config.json', prettyJSON(newContents) );

				// update config with prompt values
				var curPkg = grunt.config('pkg.config'),
					pkgExtended = _.deepExtend(curPkg, newContents);


				grunt.config('pkg.config', curPkg);

				break;

			case 'local':

				var localEnv = {};

				curContents = grunt.file.isMatch('site_config.local.json') ? grunt.file.readJSON('site_config.local.json') : {};


				// Local Database
				var promptDB = grunt.config('prompt_setup_local.database'),
					wpSlug = grunt.config('pkg.config.wp.theme.slug');

				if( promptDB.length > 0 ) {
					localEnv.database = promptDB;
				} else if( wpSlug.length > 0 && typeof curContents.environments.local.database === 'undefined' ) {
					localEnv.database = wpSlug;
				}
				

				// also do automatic things

				// Local wp_path
				var promptWpPath = grunt.config('prompt_setup_local.wp_path');
				if( promptWpPath.length > 0 )
					localEnv.wp_path = promptWpPath;
					

				// Local home_url
				var promptHomeUrl = grunt.config('prompt_setup_local.home_url');
				if( promptHomeUrl.length > 0 )
					localEnv.home_url = promptHomeUrl;


				newContents = {
					'environments': {
						'local': localEnv;
					}
				}

				var toSave = _.deepExtend(curContents, newContents);

				grunt.file.write( 'site_config.local.json', prettyJSON );

				break;


			case 'user':

				break;

	});

}