var fs = require('fs');

module.exports = function(grunt) {
	grunt.registerTask('wp_install', 'Installs WP & DB tables from scratch.', function(){

		// determine if this is a new site by checking if site_config.json exists
		var isBrandNew = !fs.existsSync('./site_config.json');

		grunt.task.run('notify:prompt');

		// BEFORE INSTALLING
		//////////////////////

		if(isBrandNew){

			// Initialize the repo

			// prompt for WP project info & setup repo site_config.json file
			grunt.task.run([
				'prompt:repo_config',
				'write_site_config:repo'
			]);

		}



		// INSTALL IT
		///////////////

		grunt.task.run([
			'prompt:sudo_pass',
			'write_site_config:local',
			'wp_cli:download_core',
			'wp_cli:core_config',
			'wp_cli:db_create',
			'wp_cli:install_core',
			'wp_cli:install_plugins',
			'wp_cli:remove_plugins',
			'wp_cli:rewrite_flush',
			'symlink:theme',
			'apache_config'
		]);


		// AFTER INSTALLING
		/////////////////////

		if(isBrandNew){

			// update style.css output for WP theme config
			grunt.task.run('wp_theme_css');


		} else {

			var dbEnvironment = grunt.config.process( '<%= pkg.config.db_master %>' );
			
			if(dbEnvironment.length > 0 && dbEnvironment != "local"){

				// migrate data
				grunt.task.run([
					'notify:db_migrate_start',
					'pull_db:' + dbEnvironment,
					'notify:db_migrate_complete',
					'pull_uploads:' + dbEnvironment
				]);

			}

		}

	});
}