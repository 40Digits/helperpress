var fs = require('fs'),
	FileSection = require(__dirname + '/../node_modules/file-section');

module.exports = function(grunt){

	grunt.registerTask('pull_uploads', 'Syncs WP uploads', function(environment){

		switch(grunt.config('pkg.config.environments.local.uploads_sync')){

			case 'rewrite':
				var htaccess = new FileSection({
						filename: './www/.htaccess',
						marker: {
							start: '# BEGIN HelperPress',
							end: '# END HelperPress'
						}
					}),

					rewriteBase = grunt.config('pkg.config.apache.scheme') === 'subdir' ? grunt.config('pkg.config.environments.local.wp.theme.slug') : '/',
					rewriteHost = grunt.config('pkg.config.environments.' + grunt.config('pkg.config.db_master') + '.home_url'),

					rewriteContents = [
						'RewriteEngine On',
						'RewriteBase ' + rewriteBase,
						'RewriteRule ^wp-content/uploads/(.+) http://' + rewriteHost + '/wp-content/uploads/$1 [L]'
					];

					htaccess.write( rewriteContents );
					break;


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