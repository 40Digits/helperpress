module.exports = function(grunt){

	grunt.registerTask('pull_uploads', 'Syncs WP uploads', function(environment){

		switch(grunt.config('pkg.config.environments.local.uploads_sync')){

			case 'rsync':
			default:
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