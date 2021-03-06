module.exports = function(grunt){

	function setRewriteRules(action){
		var FileSection = require(__dirname + '/../lib/file-section');
			htaccess = new FileSection({
				filename: grunt.config('helperpress.build_dir') + '/.htaccess',
				marker: {
					start: '# BEGIN HelperPress',
					end: '# END HelperPress'
				}
			}),

			rewriteContents = [];

		if( typeof action === 'undefined' ){
			action = 'enable';
		}

		if(action === 'enable'){
			var rewriteBase = grunt.config('helperpress.apache.scheme') === 'subdir' ? grunt.config('helperpress.environments.local.wp.theme.slug') : '/',
				rewriteHost = grunt.config('helperpress.environments.' + grunt.config('helperpress.db_master') + '.home_url');

			rewriteContents = [
				'RewriteEngine On',
				'RewriteBase ' + rewriteBase,
				'RewriteRule ^wp-content/uploads/(.+) http://' + rewriteHost + '/wp-content/uploads/$1 [L]'
			];

			// update site_config via write_site_config task
			grunt.config('write_helperpress_config.rewrite_rules', {
				options: {
					type: 'local',
					settings: {
						uploads_sync: 'rewrite'
					}
				}
			});

			grunt.task.run('write_helperpress_config:rewrite_rules');
		}

		htaccess.write( rewriteContents );
	}

	grunt.registerTask( 'wp_uploads_rewrite', 'Enables or disables .htaccess rules that rewrite all wp-uploads URLs to db_master environment.', setRewriteRules);

};