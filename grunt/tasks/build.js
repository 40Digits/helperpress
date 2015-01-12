module.exports = function(grunt){

	grunt.registerTask( 'build', function(type){

		if(typeof type === 'undefined')
			type = "dist";

		if(type == "dist" || type == "dev"){
			grunt.task.run("build_" + type);
		}else{
			grunt.hpLog.error('"' + type + '" is not a vaild argument for "build". Use "dist" or "dev"');
		}

	});


	// run this task to setup things for local development
	grunt.registerTask( 'build_dev', [

		'prompt:sudo_pass', // needed for apache_config

		// clean previous build
		'clean:build_dir',

		// install packages
		'composer:install',

		// Get WP files
		'wp_cli:download_core',

		// setup local config
		'write_helperpress_config:local',

		// note that we haven't finished first build yet
		'write_build_dev_incomplete:true',

		// Install WP
		'wp_cli:core_config',
		'wp_cli:db_create',
		'wp_default_user_creds',
		'wp_cli:install_core',
		'wp_cli:install_plugins',
		'symlink:custom_plugins',
		'symlink:hp_plugins',

		// symlink wp-theme into WP installation
		'symlink:theme',

		// wrap up WP-CLI stuff
		'wp_cli:remove_plugins',
		'clean:wp_default_themes',

		// config apache
		'apache_config',

		// pull DB and files from db_master
		'pull:db:_master',
		'wp_cli:rewrite_flush',

		// note that we finished first build
		'write_build_dev_incomplete:false'

	]);

	

	// run this task to setup everything for distribution
	grunt.registerTask( 'build_dist', [

		// clean previous build
		'clean:build_dir',

		// install packages
		'composer:install',

		// Get WP files
		'wp_cli:download_core',

		// setup local config
		'write_helperpress_config:local',

		// Install WP
		'wp_cli:core_config',
		'wp_cli:db_create',
		'wp_cli:install_core',
		'wp_cli:install_plugins',
		'copy:custom_plugins',
		'copy:hp_plugins',

		// build assets
		'shell:build_dist_assets',

		// copy theme into build dir
		'copy:theme',

		// wrap up WP-CLI stuff
		'wp_cli:remove_plugins',
		'wp_cli:rewrite_flush',
		'clean:wp_default_themes',

		// clean copied theme
		'clean:non_dist'

	]);
};