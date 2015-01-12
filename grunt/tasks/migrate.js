var _ = require('lodash'),
	fs = require('fs'),
	FileSection = require(__dirname + '/../lib/file-section');

module.exports = function(grunt) {

	// tasks
	grunt.registerTask(
		'push',
		'Pushes WP uploads and/or data to another environment',
		function(type, env){
			taskPicker.apply(this, [ 'push', type, env ]);
		}
	);
	grunt.registerTask(
		'pull',
		'Pulls WP uploads and/or data to another environment',
		function(type, env){
			taskPicker.apply(this, [ 'pull', type, env ]);
		}
	);

	// legacy tasks
	grunt.registerTask(
		'migrate_uploads',
		'(deprecated) Migrates WP uploads',
		function(dir, env){
			taskPicker.apply(this, [ dir, 'uploads', env ]);
		}
	);
	grunt.registerTask(
		'migrate_db',
		'(deprecated) Migrates DB and does an intelligent search and replace.',
		function(dir, env){
			taskPicker.apply(this, [ dir, 'db', env ]);
		}
	);
	grunt.registerTask(
		'migrate',
		'(deprecated) Migrates all data from one WP install to another',
		function(dir, env){
			taskPicker.apply(this, [ dir, 'both', env ]);
		}
	);

	function taskPicker(dir, type, env){

		// set defaults
		if(typeof dir === 'undefined')
			dir = 'pull';

		if(typeof env === 'undefined' || env === '_master'){
			// assume helperpress.db_master
			grunt.hpLog.writeln('Migrating from configured helperpress.db_master');
			env = grunt.config.process( '<%= helperpress.db_master %>' );

			if(!env){
				return grunt.hpLog.writeln('helperpress.db_master not defined.');
			}else if(env === 'local' || env === grunt.config('helperpress.alias_local_env') ){
				return grunt.hpLog.warn('helperpress.db_master defined as current environment. Aborting migration.');
			}
		}

		// which function should we use?
		if(typeof type === 'undefined' || type == 'both')
			return migrate.apply(this, [ dir, env ]);

		if(type == 'uploads')
			return uploads.apply(this, [ dir, env ]);

		if(type == 'db')
			return db.apply(this, [ dir, env ]);

	}

	// "migrate" task function
	function migrate(direction, env){
		// migrate all data
		db.apply(this, [direction, env]);
		uploads.apply(this, [direction, env]);
	}

	// "migrate_uploads" task function
	function uploads(direction, environment){

		var migrateTask;

		// if someone migrates uploads while set to rewrite method, switch it
		_switchToCopyMethod();

		// warn and skip if there's no local uploads dir yet
		var localUploadsDir = grunt.option('projectdir') + '/<%= helperpress.build_dir %>/wp-content/uploads';
		if( !fs.existsSync( grunt.config.process(localUploadsDir) ) && direction !== 'pull' ){
			//make the dir
			fs.mkdirSync( grunt.config.process(localUploadsDir) );
		}

		// migrate uploads based on migrate_uploads_method
		switch(grunt.config('helperpress.environments.' + environment + '.migrate_uploads_method')){

			case 'rsync':

				// creds helper stuff
				var RsyncCredsHelper = require('../lib/rsync-ssh-creds-helper')(grunt),
					rsyncHelper = new RsyncCredsHelper(environment);

				// rsync config					
				var rsyncOpts = {
						recursive: true
					},
					remoteDir =  rsyncHelper.getConnectionString() + ':<%= helperpress.environments.' + environment + '.wp_path %>/wp-content/uploads/',
					localDir = localUploadsDir + '/';

				// setup rsyncOpts.src and rsyncOpts.dest based on direction
				if(direction === 'pull'){
					rsyncOpts.src = remoteDir;
					rsyncOpts.dest = localDir;
				} else {
					rsyncOpts.src = localDir;
					rsyncOpts.dest = remoteDir;
				}

				// add credentials to rsyncOpts
				rsyncOpts = rsyncHelper.opts(rsyncOpts);

				// Dynamically set rsync config
				grunt.config('rsync.' + environment + '_uploads_migrate', {
					options: rsyncOpts
				});

				migrateTask = 'rsync:' + environment + '_uploads_migrate';

				break;


			case 'sftp':

				var sftpCredsHelper = require('../lib/sftp-creds-helper')(grunt),

					localBasePath = grunt.option('projectdir') + '/<%= helperpress.build_dir %>/wp-content/',
					remoteBasePath = '<%= helperpress.environments.' + environment + '.ftp_wp_path %>/wp-content/',

					// args to be passed to sftp task
					sftpFiles = {},
					sftpOpts = sftpCredsHelper(environment, {
						createDirectories: true,
						directoryPermissions: parseInt(777, 8),
						showProgress: true,
						path: remoteBasePath
					});


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

			default:
				grunt.hpLog.ok('This environment\'s migrate_uplaods_method is set to "none" or is not defined. Skipping migration.');
		}


		// run it!
		grunt.task.run([
			'notify:migrate_uploads_start',
			migrateTask,
			'notify:migrate_uploads_complete'
		]);

	}

	// "migrate_db" task function
	function db(direction, environment){

		grunt.task.run('notify:migrate_db_start');

		// migrate DB based on migrate_db_method
		switch(grunt.config('helperpress.environments.' + environment + '.migrate_db_method' )){

			case 'ssh':
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

					// import replaced database to remote
					var remoteImportConfig = remoteConfig,
						migrateDumpFile = _prepareLocalDBPush(environment);

					remoteImportConfig.import_from = './db/migrate/' + migrateDumpFile;
					grunt.config('db_import.migrate_' + environment + '.options', remoteImportConfig);
					grunt.task.run('db_import:migrate_' + environment);

				}
				break;

			case 'plugin':
				var sftpCredsHelper = require('../lib/sftp-creds-helper')(grunt),
					dbName = '<%= helperpress.environments.local.db.database %>';

				// are we pulling or pushing?
				if(direction === 'pull'){

					// request a dump file path
					var	dumpFile = 'db/backups/<%= grunt.template.today(\'yyyy-mm-dd\') %>_' + environment + '.sql';

					// tell the WP plugin to do a dump
					grunt.config('hp_wp_plugin.' + environment + '_do_dump', {
						options: {
							environment: environment,
							method: 'dump_db'
						}
					});
					grunt.task.run('hp_wp_plugin:' + environment + '_do_dump');

					// that task will save the filename to our config
					var remoteDumpFile = '<%= helperpress.environments.' + environment + '._db_dump %>';

					// SFTP down the dumpfile
					var sftpFiles = {},
						sftpOpts = sftpCredsHelper(environment, {
							srcBasePath: '<%= helperpress.environments.' + environment + '.ftp_wp_path %>/',
							destBasePath: './',
							mode: 'download'
						});

					sftpFiles[dumpFile] = remoteDumpFile;

					grunt.config('sftp.' + environment + '_download_dump', {
						options: sftpOpts,
						files: sftpFiles
					});
					grunt.task.run('sftp:' + environment + '_download_dump');

					// import the dump
					_importToLocalDB(dumpFile, dbName);

					// search & replace
					_searchAndReplaceDB(environment, 'local', dbName);

				}else{

					// get a dump file prepped for the target environment
					var migrateDumpFile = _prepareLocalDBPush(environment);

					// SFTP up the dumpfile
					var remoteBasePath = '<%= helperpress.environments.' + environment + '.ftp_wp_path %>/wp-content/_helperpress/imports/',
						sftpOpts = sftpCredsHelper(environment, {
							srcBasePath: './db/migrate/',
							destBasePath: remoteBasePath,
							mode: 'upload',
							path: remoteBasePath
						});

					grunt.config('sftp.' + environment + '_upload_dump', {
						options: sftpOpts,
						files: [{
							src: sftpOpts.srcBasePath + migrateDumpFile,
							dest: sftpOpts.destBasePath + migrateDumpFile
						}]
					});
					grunt.task.run('sftp:' + environment + '_upload_dump');

					// tell the WP plugin to import our dump
					grunt.config('hp_wp_plugin.' + environment + '_import_dump', {
						options: {
							environment: environment,
							method: 'import_db',
							file: migrateDumpFile
						}
					});
					grunt.task.run('hp_wp_plugin:' + environment + '_import_dump');

				}
				break;

			default:
				grunt.hpLog.ok('This environment\'s "migrate_db_method" is set to "none" or is not defined. Skipping migration.');

		}

		if(direction == 'push'){
			// always flush rewrite rules when pushing
			grunt.task.run('hp_wp_plugin:flush_rewrite_rules');
		}


		grunt.task.run('notify:migrate_db_complete');

	}

	// runs a bunch of functions to prepare the local DB for environment
	function _prepareLocalDBPush(environment){

		var dumpFile = 'db/backups/<%= grunt.template.today(\'yyyy-mm-dd\') %>_local.sql',
			dbName = '<%= helperpress.environments.local.db.database %>',
			migrateDumpFile = '<%= grunt.template.today(\'yyyy-mm-dd\') %>_' + environment + '.sql',
			migrateDBName = dbName + '_' + environment;

		// dump local
		_dumpLocalDB(dbName, dumpFile);

		// import to temp local db so we can search and replace in it
		_importToLocalDB(dumpFile, migrateDBName);

		// search and replace
		_searchAndReplaceDB('local', environment, migrateDBName);

		// dump replaced database
		_dumpLocalDB(migrateDBName, 'db/migrate/' + migrateDumpFile);

		return migrateDumpFile;
	}

	// dumps local database specified by dbName to dumpFile
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

	// import dumpFile locally as dbName
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

	// searches dbName and replacing environment specifics in fromEnv with toEnv
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

	// disables htaccess rewrite and updates config to use copy migrate method
	function _switchToCopyMethod(){
		if(grunt.config('helperpress.uploads_sync') !== 'copy'){

			// if we're using the htaccess rewrite method, disable it
			grunt.task.run('wp_uploads_rewrite:disable');

			// ...and update the active setting
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
	}

};