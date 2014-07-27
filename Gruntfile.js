module.exports = function (grunt) {

	var gruntConfig = {},

		_ = require('lodash'),
		userhome = require('userhome');

	/////////
	// CSS //
	/////////

	// SASS
	grunt.loadNpmTasks('grunt-contrib-sass');
	gruntConfig.sass =
		{
			dev: {
				options: {
					style: 'expanded',
					lineNumbers: true,
					sourcemap: false, // TODO: add SASS source maps
					compass: false
				},
				files: [{
					expand: true,
					cwd: '<%= pkg.config.sass_dir %>',
					src: ['*.{scss,sass}'],
					dest: '<%= pkg.config.css_dir %>',
					ext: '.css'
				}]
			},
			dist: {
				options: {
					style: 'compressed',
					compass: false
				},
				files: [{
					expand: true,
					cwd: '<%= pkg.config.sass_dir %>',
					src: ['*.{scss,sass}'],
					dest: '<%= pkg.config.css_dir %>/',
					ext: '.css'
				}]
			}
		};

	// Autoprefixer
	grunt.loadNpmTasks('grunt-autoprefixer');
	gruntConfig.autoprefixer =
		{
			options: {
				browsers: ['last 2 version', 'ie 9']
			},
			// prefix all files
			multiple_files: {
				expand: true,
				flatten: true,
				src: '<%= pkg.config.assets %>/_src/css/raw/*.css',
				dest: '<%= pkg.config.assets %>/_src/css/prefix/'
			},
		};

	// Combine Media Queries
	grunt.loadNpmTasks('grunt-combine-media-queries');
	gruntConfig.cmq =
		{
			your_target: {
				files: {
					'<%= pkg.config.sass_dir %>/*.{scss,sass}': ['<%= pkg.config.assets %>/_src/css/prefix/*.css']
				}
			}
		};


	////////////////
	// Javascript //
	////////////////

	// TODO: Add Bower

	// JS Hint
	grunt.loadNpmTasks('grunt-contrib-jshint');
	gruntConfig.jshint =
		{
			all: ['gruntfile.js', '<%= pkg.config.assets %>/js/main.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		};

	// Uglify
	grunt.loadNpmTasks('grunt-contrib-uglify');
	gruntConfig.uglify =
		{
			my_target: {
				files: {
					'<%= pkg.config.assets %>/_src/js/app/script.min.js': ['<%= pkg.config.assets %>/js/main.js']
				}
			}
		};

	// Concatenate
	grunt.loadNpmTasks('grunt-contrib-concat');
	gruntConfig.concat = 
		{
			options: {
				separator: ';',
			},
			dist: {
				src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
				dest: 'dist/built.js',
			}
		};



	// Git
	grunt.loadNpmTasks('grunt-githooks');
	// TODO: add git hooks
	//			- dont allow committing built assets
	//			- check for php or JS errors
	//			- check for passwords being commited

	// Subtrees
	grunt.loadTasks('./grunt/grunt-gitsubtrees/tasks');
	// Subtrees are configured in package.json which is loaded before use

	// MySQL 
	grunt.loadNpmTasks('grunt-mysql-dump');

	// WP
	grunt.loadTasks('./grunt/grunt-wp-cli/tasks');
	gruntConfig.wp_cli =
		{
			options: {
				cmdPath: './vendor/bin/wp'
			}
		}; 

	// Search-Replace-DB
	grunt.loadTasks('./grunt/grunt-search-replace-db/tasks');

	// PHP Composer
	grunt.loadNpmTasks('grunt-composer');

	// Symlink
	grunt.loadNpmTasks('grunt-contrib-symlink');

	// Watch
	grunt.loadNpmTasks('grunt-contrib-watch'); 
	gruntConfig.watch =
		{
			sass: {
				files: '<%= pkg.config.sass_dir %>/*.{scss,sass}',
				tasks: ['sass:dev'],
				options: {
					livereload: true
				}
			}
		};



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

		grunt.config('db_dump', migrateOpts);
		grunt.task.run('db_dump');
	});

	grunt.registerTask('setup', 'Setup and configure all the things.', function(){
		// prompt for WP project info, write to package.json

		// install composer packages
		grunt.task.run('composer:update');

		// install git subtrees
		grunt.config('gitsubtrees', grunt.config.process( '<%= pkg.config.subtrees %>' ));
		grunt.task.run('gitsubtrees');

		// install git hooks

		// bower

		// update style.css output for WP theme config		
		
		// pull db
		var dbEnvironment = grunt.config.process( '<%= pkg.config.db_master %>' );
		if( dbEnvironment.length > 0 ) {
			grunt.task.run('pull_db:' + dbEnvironment);
		}

		// install WP core
		// make wp-config.php
		// create DB table
		// install WP plugins
		var wpCliOpts = {
			install_core: './www',
			core_config: {
				dbname: '<%= pkg.config.environments.local.db.database %>',
				dbuser: '<%= pkg.config.environments.local.db.user %>',
				dbpass: '<%= pkg.config.environments.local.db.pass %>',
				dbhost: '<%= pkg.config.environments.local.db.host %>'
			},
			db_create: true,
			install_plugins: grunt.config.process( '<%= pkg.config.wp.plugins %>' )
		};

		wpCliOpts = _.extend(grunt.config('wp_cli'), wpCliOpts);
		grunt.config('wp_cli', wpCliOpts);
		grunt.task.run('wp_cli');


		// symlinks
		var symLinkOpts =
			{
				options: {
					overwrite: false
				},
				theme: {
					src: 'wp-theme',
					dest: 'www/wp-content/themes/' + grunt.config.process( '<%= pkg.config.wp.theme_slug %>' )
				}
			};
		grunt.config('symlink', symLinkOpts);
		grunt.task.run('symlink');


		// setup localhost - https://www.npmjs.org/package/grunt-localhosts - maybe extend package.json with a package.local for local URL?
	});

	grunt.registerTask('update', 'Update all the things.', function(){
		// prompt checklist of things to update

		// update WP core
		// update WP plugins

		// migrate DB down

		// update git subtrees

		// update composer
	});

	grunt.registerTask('default', ['watch']); // TODO: this should be a main menu prompt


	// Load config
	var packageJSON = grunt.file.readJSON('package.json'),
		userPackageJSON = grunt.file.exists( userhome('.wpe_defaults') ) ? grunt.file.readJSON( userhome('.wpe_defaults') ) : {};
		localPackageJSON = grunt.file.exists('package.json.local') ? grunt.file.readJSON('package.json.local') : {};

	// wrap config objects for extending
	userPackageJSON = { config: userPackageJSON };
	localPackageJSON = { config: localPackageJSON };

	gruntConfig.pkg = _.extend( packageJSON, [ userPackageJSON, localPackageJSON ] );
	
	grunt.initConfig(gruntConfig);

};