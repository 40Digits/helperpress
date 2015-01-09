var fs = require('fs');

module.exports = function(grunt){

	function writeUserCredsFile(){
		var filename = grunt.option('projectdir') + '/wp-default-user-creds.txt',
			fileContents = {
				user: grunt.config('wp_cli.install_core.admin_user'),
				password: grunt.config('wp_cli.install_core.admin_password'),
				email: grunt.config('wp_cli.install_core.admin_email')
			};

		if( fs.existsSync(filename) ){
			return grunt.log.ok('User credentials file exists, assuming WP DB has already been initialized. Skipping write.');
		}

		grunt.file.write(filename, JSON.stringify(fileContents) );
	}

	grunt.registerTask( 'wp_default_user_creds', 'Creates wp-default-user-creds.txt and places default user credentials into it.', writeUserCredsFile);

};