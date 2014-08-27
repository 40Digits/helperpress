var _ = require('lodash'),
	fs = require('fs'),
	FileSection = require(__dirname + '/../node_modules/file-section');

module.exports = function(grunt){

	function migrate(direction, env){

		if(typeof direction === 'undefined'){

			// no args passed, so let's do it interactively
			// TODO

		}else if(typeof env === 'undefined' || env === '_master'){

			// assume helperpress.db_master
			grunt.log.writeln('Migrating from configured helperpress.db_master');

			env = grunt.config.process( '<%= helperpress.db_master %>' );

			if(!env){

				return grunt.oklns('helperess.db_master not defined. Skipping migration.');

			}else if(env === 'local'){
				// TODO: create an env alias option so when we're on a non-local env we still check correctly

				return grunt.oklns('helperess.db_master defined as this environement. Skipping migration.');

			}

		}

		// migrate data
		pull_db(env);
		pull_uploads(env);

	}



	function pull_uploads(environment){

		switch(grunt.config('helperpress.environments.local.uploads_sync')){

			case 'rewrite':
				var htaccess = new FileSection({
						filename: grunt.config('helperpress.build_dir') + '/.htaccess',
						marker: {
							start: '# BEGIN HelperPress',
							end: '# END HelperPress'
						}
					}),

					rewriteBase = grunt.config('helperpress.apache.scheme') === 'subdir' ? grunt.config('helperpress.environments.local.wp.theme.slug') : '/',
					rewriteHost = grunt.config('helperpress.environments.' + grunt.config('helperpress.db_master') + '.home_url'),

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
						src: '<%= helperpress.environments.' + environment + '.ssh_host %>:<%= helperpress.environments.' + environment + '.wp_path %>/wp-content/uploads',
						dest: './',
						delete: true
					}
				});

				grunt.config('rsync.' + environment + '_uploads_up', {
					options: {
						src: './uploads',
						dest: '<%= helperpress.environments.' + environment + '.ssh_host %>:<%= helperpress.environments.' + environment + '.wp_path %>/wp-content/',
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

	}


	function pull_db(environment){

		// dump & import
		var targetOpts = {
				title: '<%= helperpress.environments.' + environment + '.title %>',

				database: '<%= helperpress.environments.' + environment + '.db.database %>',
				user: '<%= helperpress.environments.' + environment + '.db.user %>',
				pass: '<%= helperpress.environments.' + environment + '.db.pass %>',
				host: '<%= helperpress.environments.' + environment + '.db.host %>',

				ssh_host: '<%= helperpress.environments.' + environment + '.ssh_host %>'
			};


		grunt.task.run('notify:db_migrate_start');

		// dump it
		grunt.config('db_dump.' + environment + '.options', targetOpts);
		grunt.task.run('db_dump:' + environment);

		// import it
		grunt.config('db_import.local.options.import_from', 'db/backups/<%= grunt.template.today(\'yyyy-mm-dd\') %>_' + environment + '.sql');
		grunt.config('db_import.local.options.title', '<%= helperpress.environments.' + environment + '.title %>');
		grunt.task.run('db_import:local');

		// search and replace it
		var searchReplaceOpts = 
			{
				home_url: {
					search: '<%= helperpress.environments.' + environment + '.home_url %>',
					replace: '<%= helperpress.environments.local.home_url %>'
				},
				wp_path: {
					search: '<%= helperpress.environments.' + environment + '.wp_path %>',
					replace: '<%= helperpress.environments.local.wp_path %>'
				}
			}; 


		var curConf = grunt.config('search_replace_db');
		grunt.config( 'search_replace_db', _.extend(curConf, searchReplaceOpts) );
		grunt.task.run('search_replace_db');

		grunt.task.run('notify:db_migrate_complete');

	}


	grunt.registerTask('pull_uploads', 'Syncs WP uploads', pull_uploads);
	grunt.registerTask('pull_db', 'Pull DB from specified environment into local DB.', pull_db);
	grunt.registerTask('migrate', 'Migrates data from one WP install to another', migrate);

};