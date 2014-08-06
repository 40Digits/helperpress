var _ = require('lodash');

module.exports = function(grunt) {
	grunt.registerTask('pull_db', 'Pull DB from specified environment into local DB.', function(environment){

		// dump & import
		var targetOpts = {
				title: '<%= pkg.config.environments.' + environment + '.title %>',

				database: '<%= pkg.config.environments.' + environment + '.db.database %>',
				user: '<%= pkg.config.environments.' + environment + '.db.user %>',
				pass: '<%= pkg.config.environments.' + environment + '.db.pass %>',
				host: '<%= pkg.config.environments.' + environment + '.db.host %>',

				ssh_host: '<%= pkg.config.environments.' + environment + '.ssh_host %>'
			};

		// dump it
		grunt.config('db_dump.' + environment + '.options', targetOpts);
		grunt.task.run('db_dump:' + environment);

		// import it

		grunt.config('db_import.local.options.import_from', 'db/backups/<%= grunt.template.today(\'yyyy-mm-dd\') %>_' + environment + '.sql');
		grunt.config('db_import.local.options.title', '<%= pkg.config.environments.' + environment + '.title %>');
		grunt.task.run('db_import:local');

		// search and replace it
		var searchReplaceOpts = 
			{
				home_url: {
					search: '<%= pkg.config.environments.' + environment + '.home_url %>',
					replace: '<%= pkg.config.environments.local.home_url %>'
				},
				wp_path: {
					search: '<%= pkg.config.environments.' + environment + '.wp_path %>',
					replace: '<%= pkg.config.environments.local.wp_path %>'
				}
			}; 



		var curConf = grunt.config('search_replace_db');
		grunt.config( 'search_replace_db', _.extend(curConf, searchReplaceOpts) );
		grunt.task.run('search_replace_db');

	});
}