module.exports = function(grunt) {
	grunt.registerTask('pull_db', 'Pull DB from specified environment into local DB.', function(environment){

		// dump & import
		var targetOpts = {
				database: '<%= pkg.config.environments.' + environment + '.db.database %>',
				user: '<%= pkg.config.environments.' + environment + '.db.user %>',
				pass: '<%= pkg.config.environments.' + environment + '.db.pass %>',
				host: '<%= pkg.config.environments.' + environment + '.db.host %>',
				ssh_host: '<%= pkg.config.environments.' + environment + '.ssh_host %>',

				backup_to: 'db-backups/' + environment + '.sql'
			},
			dumpOpts = {};

		dumpOpts[environment] = targetOpts;

		// dump it
		grunt.config('db_dump', dumpOpts);
		grunt.task.run('db_dump:' + environment);

		// import it
		grunt.task.run('db_import:' + environment);

		// search and replace it
		var searchReplaceOpts = 
			{
				options: {
					globalFlags: {
						host: '<%= pkg.config.environments.local.db.host %>',
						name: '<%= pkg.config.environments.local.db.database %>',
						user: '<%= pkg.config.environments.local.db.user %>',
						pass: '<%= pkg.config.environments.local.db.pass %>'
					},
				},
				home_url: {
					search: '<%= pkg.config.environments.' + environment + '.home_url %>',
					replace: '<%= pkg.config.environments.local.home_url %>'
				},
				wp_path: {
					search: '<%= pkg.config.environments.' + environment + '.wp_path %>',
					replace: '<%= pkg.config.environments.local.wp_path %>'
				}
			}; 

		grunt.config('db_dump', searchReplaceOpts);
		grunt.task.run('db_dump');

	});
}