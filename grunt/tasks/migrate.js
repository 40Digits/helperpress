var _ = require('lodash'),
	fs = require('fs'),
	FileSection = require(__dirname + '/../lib/file-section');

module.exports = function(grunt){

	function migrate(direction, env){

		// migrate all data
		db.apply(this, [direction, env]);
		uploads.apply(this, [direction, env]);

	}



	function uploads(direction, environment){

		var migrateTask;

		if(typeof direction === 'undefined'){

			direction = 'pull';

		}

		if(typeof environment === 'undefined' || environment === '_master'){

			// assume helperpress.db_master
			grunt.log.writeln('Migrating from configured helperpress.db_master');

			environment = grunt.config.process( '<%= helperpress.db_master %>' );

			if(!environment){

				return grunt.log.ok('helperpress.db_master not defined. Skipping migration.');

			}else if(environment === 'local' || environment === grunt.config('helperpress.alias_local_env') ){

				return grunt.log.ok('helperpress.db_master defined as this environement. Skipping migration.');

			}

		}

		if(grunt.config('helperpress.uploads_sync') !== 'copy'){

			// if we're currently using the htaccess rewrite method, disable it
			grunt.task.run('wp_uploads_rewrite:disable');

			// ...and update the config setting
			grunt.config('write_helperpress_config.migrate_upload', {
				options:{
					type: 'local',
					settings: {
						uploads_sync: 'copy'
					}
				}
			});

			grunt.task.run('write_helperpress_config:migrate_upload');

		}


		switch(grunt.config('helperpress.environments.' + environment + '.migrate_uploads_method')){

			case 'rsync':

				var sshInfo = grunt.config.process('<%= helperpress.environments.' + environment + '.ssh %>'),
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
				if(typeof sshInfo.password !== 'undefined'){
					grunt.warn('grunt-rsync only supports passwordless SSH authentication.');
				}


				var remoteDir = sshString + ':<%= helperpress.environments.' + environment + '.wp_path %>/wp-content/uploads/',
					localDir = '<%= helperpress.build_dir %>/wp-content/uploads/';

				if(direction === 'pull'){
					rsyncOpts.src = remoteDir;
					rsyncOpts.dest = localDir;
				} else {
					rsyncOpts.src = localDir;
					rsyncOpts.dest = remoteDir;
				}


				// Dynamically set rsync config
				grunt.config('rsync.' + environment + '_uploads_migrate', {
					options: rsyncOpts
				});

				migrateTask = 'rsync:' + environment + '_uploads_migrate';

				break;


			case 'sftp':
			default:

				var sshInfo = grunt.config('helperpress.environments.' + environment + '.ssh'),

					// paths for transfer		
					localBasePath = '<%= helperpress.build_dir %>/wp-content/',
					remoteBasePath = '<%= helperpress.environments.' + environment + '.wp_path %>/wp-content/',

					// args to be passed to sftp task
					sftpOpts = {
						createDirectories: true,
						directoryPermissions: parseInt(777, 8),
						showProgress: true,
						host: '<%= helperpress.environments.' + environment + '.ssh.host %>',
						path: remoteBasePath
					},
					sftpFiles = {};

				this.requiresConfig('helperpress.environments.' + environment + '.ssh.host');

				// map HP's SSH settings to ssh task's
				if(typeof sshInfo.user !== 'undefined'){
					sftpOpts.username = sshInfo.user;
				}
				if(typeof sshInfo.pass !== 'undefined'){
					sftpOpts.password = sshInfo.pass;
				}
				if(typeof sshInfo.keyfile !== 'undefined'){
					sftpOpts.privateKey = grunt.file.read(sshInfo.keyfile);
				}
				if(typeof sshInfo.passphrase !== 'undefined'){
					sftpOpts.passphrase = sshInfo.passphrase;
				}
				if(typeof sshInfo.port !== 'undefined'){
					sftpOpts.port = sshInfo.port;
				}

				if(direction === 'pull'){

					sftpFiles['uploads'] = 'uploads';

					sftpOpts.srcBasePath = remoteBasePath;
					sftpOpts.destBasePath = localBasePath;

					sftpOpts.mode = 'download';

				} else {

					sftpFiles = [{
						cwd: localBasePath + 'uploads/',
						expand: true,
						src: '**',
						dest: remoteBasePath + 'uploads/'
					}];

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

	}


	function db(direction, environment){



		if(typeof direction === 'undefined'){

			direction = 'pull';

		}

		if(typeof environment === 'undefined' || environment === '_master'){

			// assume helperpress.db_master
			grunt.log.writeln('Migrating from configured helperpress.db_master');

			environment = grunt.config.process( '<%= helperpress.db_master %>' );

			if(!environment){

				return grunt.log.ok('helperpress.db_master not defined. Skipping migration.');

			}else if(environment === 'local' || environment === grunt.config('helperpress.alias_local_env') ){

				return grunt.log.ok('helperpress.db_master defined as this environement. Skipping migration.');

			}

		}

		grunt.task.run('notify:migrate_db_start');

		// determine proper ssh host string
		var sshHost = '<%= helperpress.environments.' + environment + '.ssh.host %>',
			sshUser = grunt.config.process('<%= helperpress.environments.' + environment + '.ssh.user %>');

		if(typeof sshUser === 'string'){
			sshHost = sshUser + '@' + sshHost;
		}

		var remoteConfig = {
			title: '<%= helperpress.environments.' + environment + '.title %>',

			database: '<%= helperpress.environments.' + environment + '.db.database %>',
			user: '<%= helperpress.environments.' + environment + '.db.user %>',
			pass: '<%= helperpress.environments.' + environment + '.db.pass %>',
			host: '<%= helperpress.environments.' + environment + '.db.host %>',

			ssh_host: sshHost
		};
	
		// are we pulling or pushing?
		if(direction === 'pull'){
			
			var localDumpFile = 'db/backups/<%= grunt.template.today(\'yyyy-mm-dd\') %>_local.sql',
				envDumpFile = 'db/backups/<%= grunt.template.today(\'yyyy-mm-dd\') %>_' + environment + '.sql',
				dbName = '<%= helperpress.environments.local.db.database %>';

			// dump remote
			remoteConfig.backup_to = envDumpFile;
			grunt.config('db_dump.' + environment + '.options', remoteConfig);
			grunt.task.run('db_dump:' + environment);

			// backup local DB
			_dumpLocalDB(dbName, localDumpFile);

			// import locally			
			_importToLocalDB(envDumpFile, dbName);

			// search & replace
			_searchAndReplaceDB(environment, 'local', dbName);

		}else{

			var dumpFile = 'db/backups/<%= grunt.template.today(\'yyyy-mm-dd\') %>_local.sql',
				dbName = '<%= helperpress.environments.local.db.database %>',
				migrateDumpFile = 'db/migrate/<%= grunt.template.today(\'yyyy-mm-dd\') %>_' + environment + '.sql',
				migrateDBName = dbName + '_' + environment

			// dump local
			_dumpLocalDB(dbName, dumpFile);

			// import to temp local db so we can search and replace in it
			_importToLocalDB(dumpFile, migrateDBName);

			// search and replace
			_searchAndReplaceDB('local', environment, migrateDBName);

			// dump replaced database
			_dumpLocalDB(migrateDBName, migrateDumpFile);

			// import replaced database to remote
			var remoteImportConfig = remoteConfig;

			remoteImportConfig.import_from = migrateDumpFile;
			grunt.config('db_import.migrate_' + environment + '.options', remoteImportConfig);
			grunt.task.run('db_import:migrate_' + environment);

		}


		grunt.task.run('notify:migrate_db_complete');

	}

	function _dumpLocalDB(dbName, dumpFile){

		// process args
		dbName = grunt.config.process(dbName);
		dumpFile = grunt.config.process(dumpFile);

		var taskID = 'hp_migrate_' + dbName,
			taskConfig = {
				title: 'Local Database "' + dbName + '"',

				database: dbName,
				user: '<%= helperpress.environments.local.db.user %>',
				pass: '<%= helperpress.environments.local.db.pass %>',
				host: '<%= helperpress.environments.local.db.host %>'
			};

		if(typeof dumpFile !== 'undefined'){
			taskConfig.backup_to = dumpFile;
		}

		grunt.config('db_dump.' + taskID + '.options', taskConfig);
		grunt.task.run('db_dump:' + taskID);

	}

	function _importToLocalDB(dumpFile, dbName){

		// process args
		dbName = grunt.config.process(dbName);
		dumpFile = grunt.config.process(dumpFile);

		var taskID = 'hp_migrate_' + dbName,
			taskConfig = {
				title: 'Local Database "' + dbName + '"',

				database: dbName,
				user: '<%= helperpress.environments.local.db.user %>',
				pass: '<%= helperpress.environments.local.db.pass %>',
				host: '<%= helperpress.environments.local.db.host %>',

				import_from: dumpFile
			};

		grunt.config('db_import.' + taskID + '.options', taskConfig);
		grunt.task.run('db_import:' + taskID);

	}

	function _searchAndReplaceDB(fromEnv, toEnv, dbName){

		// process args
		dbName = grunt.config.process(dbName);

		var searchReplaceOpts = 
			{
				options: {
					host: '<%= helperpress.environments.local.db.host %>',
					name: dbName,
					user: '<%= helperpress.environments.local.db.user %>',
					pass: '<%= helperpress.environments.local.db.pass %>',
					
					verbose: false
				},
				home_url: {
					options: {
						search: '<%= helperpress.environments.' + fromEnv + '.home_url %>',
						replace: '<%= helperpress.environments.' + toEnv + '.home_url %>'
					}
				},
				wp_path: {
					options: {
						search: '<%= helperpress.environments.' + fromEnv + '.wp_path %>',
						replace: '<%= helperpress.environments.' + toEnv + '.wp_path %>'
					}
				}
			}; 

		grunt.config( 'search_replace_db', searchReplaceOpts );
		grunt.task.run('search_replace_db');
	}



	grunt.registerTask('migrate_uploads', 'Migrates WP uploads', uploads);
	grunt.registerTask('migrate_db', 'Migrates DB and does an intelligent search and replace.', db);
	grunt.registerTask('migrate', 'Migrates all data from one WP install to another', migrate);

};