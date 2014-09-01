var _ = require('lodash'),
	fs = require('fs'),
	FileSection = require(__dirname + '/../lib/file-section');

module.exports = function(grunt){

	function migrate(direction, env){

		if(typeof direction === 'undefined'){

			// no args passed
			// TODO: let's do it interactively
			direction = 'pull';

		}

		if(typeof env === 'undefined' || env === '_master'){

			// assume helperpress.db_master
			grunt.log.writeln('Migrating from configured helperpress.db_master');

			env = grunt.config.process( '<%= helperpress.db_master %>' );

			if(!env){

				return grunt.ok('helperpress.db_master not defined. Skipping migration.');

			}else if(env === 'local'){
				// TODO: create an env alias option so when we're on a non-local env we still check correctly

				return grunt.ok('helperpress.db_master defined as this environement. Skipping migration.');

			}

		}

		// migrate data
		db.apply(this, [direction, env]);
		uploads.apply(this, [direction, env]);

	}



	function uploads(direction, environment){

		var migrateTask;

		if(grunt.config('helperpress.environments.local.migrate_uploads') == 'rewrite'){

			// if we're currently using the htaccess rewrite method, disable it
			grunt.task.run('wp_uploads_rewrite:disable');

			// ...and update the config setting
			grunt.config('write_site_config.migrate_upload', {
				type: 'local',
				settings: {
					uploads_sync: 'copy'
				}
			});

			grunt.task.run('write_site_config.migrate_upload');

		}


		switch(grunt.config('helperpress.environments.' + environment + '.migrate_uploads_method')){

			case 'rsync':

				var sshInfo = '<%= helperpress.environments.' + environment + '.ssh %>',
					sshString = '',
					rsyncOpts = {
						recursive: true
					};

				this.requiresConfig('helperpress.environments.' + environment + '.ssh');

				// build sshString
				if(typeof sshInfo.host !== 'undefined'){
					sshString = sshInfo.user !== 'undefined' ? sshInfo.user + '@' + sshInfo.host : sshInfo.host;
				}

				// maybe add some more options
				if(typeof sshInfo.keyfile !== 'undefined'){
					rsyncOpts.privateKey = sshInfo.keyfile;
				}
				if(typeof sshInfo.port !== 'undefined'){
					rsyncOpts.port = sshInfo.port;
				}

				// let em know that SSH password auth is for suckas
				if(typeof sshInfo.password !== 'password'){
					grunt.warn('grunt-rsync only supports passwordless SSH authentication.');
				}


				if(direction === 'pull'){
					rsyncOpts.src = sshString + ':<%= helperpress.environments.' + environment + '.wp_path %>/wp-content/uploads';
					rsyncOpts.dest = './';
				} else {
					rsyncOpts.src = './uploads';
					rsyncOpts.dest = sshString + ':<%= helperpress.environments.' + environment + '.wp_path %>/wp-content/';
				}


				// Dynamically set rsync config
				grunt.config('rsync.' + environment + '_uploads_migrate', {
					options: rsyncOpts
				});

				migrateTask = 'rsync:' + environment + '_uploads_migrate';

				break;


			case 'sftp':

				var sftpOpts = {
						createDirectories: true,
						showProgress: true,
						host: '<%= helperpress.environments.' + environment + '.ssh.host %>'
					},
					sftpFiles = {},

					sshInfo = grunt.config('<%= helperpress.environments.' + environment + '.ssh %>'),

					// paths for transfer		
					localBasePath = './',
					localPath = 'uploads',
					remoteBasePath = '<%= helperpress.environments.' + environment + '.wp_path %>/',
					remotePath = 'wp-content/uploads';

				this.requiresConfig('helperpress.environments.' + environment + '.ssh.host');

				// map HP's SSH settings to ssh task's
				if(typeof sshInfo.user !== 'undefined'){
					sftpOpts.username = sshInfo.user;
				}
				if(typeof sshInfo.pass !== 'undefined'){
					sftpOpts.password = sshInfo.pass;
				}
				if(typeof sshInfo.keyfile !== 'undefined'){
					sftpOpts.privateKey = sshInfo.keyfile;
				}
				if(typeof sshInfo.passphrase !== 'undefined'){
					sftpOpts.passphrase = sshInfo.passphrase;
				}
				if(typeof sshInfo.port !== 'undefined'){
					sftpOpts.port = sshInfo.port;
				}

				if(direction === 'pull'){

					sftpFiles = {
						remotePath: localPath
					};

					sftpOpts.srcBasePath = remoteBasePath;
					sftpOpts.destBasePath = localBasePath;

					sftpOpts.mode = 'download';

				} else {

					sftpFiles = {
						localPath: remotePath
					};


					sftpOpts.srcBasePath = localBasePath;
					sftpOpts.destBasePath = remoteBasePath;

					sftpOpts.mode = 'upload';

				}

				// Dynamically set sftp config
				grunt.config('sftp.' + environment + '_uploads_migrate', {
					options: sftpOpts,
					files: sftpFiles
				});

				migrateTask = 'sftp:' + environment + '_uploads_migrate';

				break;
		}


		// run it!
		grunt.task.run([
			'notify:migrate_uploads_start',
			migrateTask,
			'notify:migrate_uploads_complete'
		]);

		// make sure uploads dir is symlink'd
		if(direction == 'pull'){
			grunt.task.run('symlink:uploads');
		}

	}


	function db(direction, environment){

		// dump & import
		var targetOpts = {
				title: '<%= helperpress.environments.' + environment + '.title %>',

				database: '<%= helperpress.environments.' + environment + '.db.database %>',
				user: '<%= helperpress.environments.' + environment + '.db.user %>',
				pass: '<%= helperpress.environments.' + environment + '.db.pass %>',
				host: '<%= helperpress.environments.' + environment + '.db.host %>',

				ssh_host: '<%= helperpress.environments.' + environment + '.ssh_host %>'
			};


		grunt.task.run('notify:migrate_db_start');

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

		grunt.task.run('notify:migrate_db_complete');

	}



	grunt.registerTask('migrate_uploads', 'Migrates WP uploads', uploads);
	grunt.registerTask('migrate_db', 'Migrates DB and does an intelligent search and replace.', db);
	grunt.registerTask('migrate', 'Migrates all data from one WP install to another', migrate);

};