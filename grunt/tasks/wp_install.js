function isSiteConfigured(){
	return grunt.file.isMatch('site_config.json');
}

module.exports = function(grunt) {
	grunt.registerTask('wp_install', 'Installs WP & DB tables from scratch.', function(){

		// is this a new site or does it already exist somehwere?
		var dbEnvironment = grunt.config.process( '<%= pkg.config.db_master %>' ),
			isBrandNew = isSiteConfigured();


		// BEFORE INSTALLING
		//////////////////////

		if(isBrandNew){

			// prompt for WP project info
			grunt.task.run([
				'prompt:init_site_config',
				'setup_site_config:repo'
			]);

		}



		// INSTALL IT
		///////////////

		grunt.task.run([
			'wp_cli:download_core',
			'wp_cli:core_config',
			'wp_cli:db_create',
			'wp_cli:install_core',
			'wp_cli:install_plugins',
			'wp_cli:remove_plugins',
			'setup_site_config:local'
		]);


		// AFTER INSTALLING
		/////////////////////

		if(isBrandNew){

			// update style.css output for WP theme config
			grunt.task.run('wp_theme_css');


		} else {
			
			// pull db
			grunt.task.run('pull_db:' + dbEnvironment);

		}

	});
}