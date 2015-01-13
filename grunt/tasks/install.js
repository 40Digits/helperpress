module.exports = function(grunt){

	grunt.registerTask('install', 'Generates local config, migrates data in, builds a WP install, and configures Apache to serve it.', function(){

		var fs = require('fs'),
			hpProjConfig = grunt.option('projectdir') + 'helperpress.json';

		// make sure helperpress.json exists first
		if(!fs.existsSync(hpProjConfig))
			grunt.fatal('Looks like this isn\'t a HelperPress project. Run `hp init` instead.');

		grunt.task.run([

			// setup local config
			'write_helperpress_config:local',

			// build WP install
			'build_dev',

			// config apache and maybe hosts
			'prompt:sudo_pass', // needed for apache_config
			'apache_config',

			// pull DB and files from db_master
			'pull:db:_master',
			'wp_cli:rewrite_flush'

		]);
		
	});

};