module.exports = function(grunt) {
	grunt.registerTask('wp_install', 'Installs WP & DB tables from scratch.', function(){

		// is this a new site or does it already exist somehwere?
		var dbEnvironment = grunt.config.process( '<%= pkg.config.db_master %>' ),
			isBrandNew = ( dbEnvironment.length === 0 );


		// BEFORE INSTALLING
		//////////////////////

		if(isBrandNew){

			// prompt for WP project info

			// update loaded config

			// write to site_config.json

			// update style.css output for WP theme config

			// report generated pass to user

		}


		// INSTALL IT
		///////////////

		grunt.task.run([
			'wp_cli:download_core',
			'wp_cli:core_config',
			'wp_cli:db_create',
			'wp_cli:install_core',
			'wp_cli:install_plugins',
			'wp_cli:remove_plugins'
		]);


		// AFTER INSTALLING
		/////////////////////

		if(!isBrandNew){
			
			// pull db
			grunt.task.run('pull_db:' + dbEnvironment);

		}

	});
}