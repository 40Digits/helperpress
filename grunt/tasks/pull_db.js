var _ = require('lodash');

module.exports = function(grunt) {
	grunt.registerTask('pull_db', 'Pull DB from specified environment into local DB.', function(environment){

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

	});
}