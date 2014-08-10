module.exports = function(grunt){

	grunt.registerTask('pull_uploads', 'Syncs WP uploads', function(environment){


		switch(grunt.config('pkg.config.environments.local.uploads_sync')){

			case 'rsync':
			default:

				// Dynamically set rsync config
				grunt.config('rsync.' + environment + '_uploads_down', {
					options: {
						src: '<%= pkg.config.environments.' + environment + '.ssh_host %>:<%= pkg.config.environments.' + environment + '.wp_path %>/wp-content/uploads',
						dest: './',
						delete: true
					}
				});

				grunt.config('rsync.' + environment + '_uploads_up', {
					options: {
						src: './uploads',
						dest: '<%= pkg.config.environments.' + environment + '.ssh_host %>:<%= pkg.config.environments.' + environment + '.wp_path %>/wp-content/',
						delete: true
					}
				});

				grunt.task.run([
					'notify:pull_uploads_start',
					'rsync:' + environment + '_uploads_down',
					'notify:pull_uploads_complete',
					'symlink:uploads'
				]);
				break;

		}

	});

};