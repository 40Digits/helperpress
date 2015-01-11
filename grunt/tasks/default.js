var fs = require('fs');

module.exports = function(grunt){

	grunt.registerTask('default', 'Determines what to do based on state of repo configs', function(){

		if( !fs.existsSync('./helperpress.json') ){
			// brand new project
			grunt.task.run('init');
		}else if( !fs.existsSync('./helperpress.local.json') || grunt.config('helperpress._build_dev_incomplete')==="true" ){
			// already initialized project or last setup broke
			grunt.task.run('build_dev');
		}

	});

};