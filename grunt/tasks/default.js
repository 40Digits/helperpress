var fs = require('fs');

module.exports = function(grunt){

	grunt.registerTask('default', 'Determines what to do based on state of repo configs', function(){

		if( !fs.existsSync('./helperpress.json') ){
			// brand new project
			grunt.task.run([
				'init_project',
				'build_dev'
			]);
		}else if( !fs.existsSync('./helperpress.local.json') ){
			// already initialized project
			grunt.task.run('build_dev');
		}else{
			// all ready to go, watch
			grunt.task.run('watch');
		}

	});

};