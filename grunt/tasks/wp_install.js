var fs = require('fs');

module.exports = function(grunt) {
	grunt.registerTask('wp_install', 'Installs WP & DB tables from scratch.', function(){

		var dbEnvironment = grunt.config.process( '<%= pkg.config.db_master %>' ),

			// determine if this is a new site by checking if site_config.json exists
			isBrandNew = !fs.existsSync('./site_config.json');


		// BEFORE INSTALLING
		//////////////////////

		if(isBrandNew){

			// prompt for WP project info & setup repo site_config.json file
			grunt.task.run([
				'prompt:repo_config',
				'setup_site_config:repo'
			]);

		}



		// INSTALL IT
		///////////////

		grunt.task.run([
			'setup_site_config:local',
			'wp_cli:download_core',
			'wp_cli:core_config',
			'wp_cli:db_create',
			'wp_cli:install_core',
			'wp_cli:install_plugins',
			'wp_cli:remove_plugins',
			'apache_config'
		]);


		// AFTER INSTALLING
		/////////////////////

		if(isBrandNew){

			// update style.css output for WP theme config
// TODO		grunt.task.run('wp_theme_css');


		} else {
			
			if(dbEnvironment.length > 0 && dbEnvironment != "local"){

				console.log(dbEnvironment);
				// pull db
				grunt.task.run('pull_db:' + dbEnvironment);
			}

		}

	});
}