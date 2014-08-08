module.exports = function(gruntConfig){

	var exports = {
		options: {
			args: ['--verbose', '-L'], // -L: follow symlinks
			recursive: true
		}
	};

	// Dynamically set environments
	for(var env in gruntConfig.pkg.config.environments){

		if(env === 'local'){
			continue;
		}

		exports[env + '_deploy'] = {
			options: {
				src: './_dist',
				dest: '<%= pkg.config.environments.' + env + '.ssh_host %>:<%= pkg.config.environments.' + env + '.wp_path %>',
				delete: true
			}
		};

		exports[env + '_uploads_down'] = {
			options: {
				src: '<%= pkg.config.environments.' + env + '.ssh_host %>:<%= pkg.config.environments.' + env + '.wp_path %>/wp-content/uploads',
				dest: './',
				delete: true
			}
		};

		exports[env + '_uploads_up'] = {
			options: {
				src: './uploads',
				dest: '<%= pkg.config.environments.' + env + '.ssh_host %>:<%= pkg.config.environments.' + env + '.wp_path %>/wp-content/',
				delete: true
			}
		};
	}

	return exports;
};