module.exports = function (grunt) {

	var gruntConfig = {},

		_ = require('lodash'),
		_deepExtend = require('underscore-deep-extend'),
		randomstring = require('randomstring'),
		userhome = require('userhome');

	// initialize _deepExtend into _ object
	_.mixin({deepExtend: _deepExtend(_)});

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
				src: '<%= pkg.config.assets_dir %>/_src/css/raw/*.css',
				dest: '<%= pkg.config.assets_dir %>/_src/css/prefix/'
			},
		};

	// Combine Media Queries
	grunt.loadNpmTasks('grunt-combine-media-queries');
	gruntConfig.cmq =
		{
			your_target: {
				files: {
					'<%= pkg.config.sass_dir %>/*.{scss,sass}': ['<%= pkg.config.assets_dir %>/_src/css/prefix/*.css']
				}
			}
		};


	////////////////
	// Javascript //
	////////////////

	// Bower
	grunt.loadNpmTasks('grunt-bower-task');
	gruntConfig.bower = 
		{
			install: {
				options: {
					targetDir: 'bower_components'
				}
			}	
		}

	// Bower concat
	grunt.loadNpmTasks('grunt-bower-concat');
	gruntConfig.bower_concat = 
		{
			dest: '<%= pkg.config.assets_dir %>/_src/compiled/js/bower.js'
		}

	// JS Hint
	grunt.loadNpmTasks('grunt-contrib-jshint');
	gruntConfig.jshint =
		{
			all: ['gruntfile.js', '<%= pkg.config.assets_dir %>/js/main.js'],
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
					'<%= pkg.config.assets_dir %>/js/main.min.js': ['<%= pkg.config.assets_dir %>/js/main.js']
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

	// PHP Lint
	grunt.loadNpmTasks('grunt-phplint');
	gruntConfig.phplint = 
		{
			// good: ['test/rsrc/*-good.php'],
			// bad: ['test/rsrc/*-fail.php']
		}


	// Git
	grunt.loadNpmTasks('grunt-githooks');
	gruntConfig.githooks = 
		{
			all: {
				options: {
					template: 'hooks/pre-commit.js' //
				},
				'pre-commit': 'jshint phplint'
			}
		}

	// TODO: add git hooks
	//			- dont allow committing built assets
	//			- check for passwords being commited

	// Subtrees
	grunt.loadTasks('./grunt/grunt-gitsubtrees/tasks');
	// Subtrees are configured in external config files
	gruntConfig.gitsubtrees = '<%= pkg.config.subtrees %>';

	// MySQL 
	grunt.loadNpmTasks('grunt-mysql-dump');

	// WP
	grunt.loadTasks('./grunt/grunt-wp-cli/tasks');
	
	var wpRndPass = randomstring.generate(10); // in case we're installing it fresh
	gruntConfig.wp_cli =
		{
			options: {
				cmdPath: './vendor/bin/wp',
				wpPath: './www'
			},

			download_core: true,

			core_config: {
				dbname: '<%= pkg.config.environments.local.db.database %>',
				dbuser: '<%= pkg.config.environments.local.db.user %>',
				dbpass: '<%= pkg.config.environments.local.db.pass %>',
				dbhost: '<%= pkg.config.environments.local.db.host %>'
			},

			db_create: true,

			install_core: {
				url: '<%= pkg.config.environments.local.url %>',
				title: '<%= pkg.config.environments.wp.theme.name %>',
				admin_user: '40digits',
				admin_password: wpRndPass,
				admin_email: 'j3k.porkins@gmail.com'
			},

			install_plugins: '<%= pkg.config.wp.plugins %>',

			remove_plugins: ['hello']
		}; 

	// Search-Replace-DB
	grunt.loadTasks('./grunt/grunt-search-replace-db/tasks');

	// PHP Composer
	grunt.loadNpmTasks('grunt-composer');

	// Symlink
	grunt.loadNpmTasks('grunt-contrib-symlink');
	gruntConfig.symlink =
		{
			options: {
				overwrite: false
			},
			theme: {
				src: 'wp-theme',
				dest: 'www/wp-content/themes/<%= pkg.config.wp.theme_slug %>'
			},
			sites: {
				src: 'www',
				dest: '<%= pkg.config.environments.local.wp.wp_path %>'
			}
		};

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

	// Clean
	grunt.loadNpmTasks('grunt-contrib-clean');
	gruntConfig.clean = 
		{
			build: ['bower_components', 'vendor', 'db-backup', 'www']
		}


	grunt.registerTask('wp_install', 'Installs WP & DB tables from scratch.', function(){

		// is this a new site or does it already exist somehwere?
		var dbEnvironment = grunt.config.process( '<%= pkg.config.db_master %>' ),
			isBrandNew = ( dbEnvironment.length === 0 );


		// BEFORE INSTALLING
		//////////////////////

		if(isBrandNew){

			// prompt for WP project info

			// update loaded config

			// write to site_config.json

			// update style.css output for WP theme config

			// report generated pass to user

		}


		// INSTALL IT
		///////////////

		grunt.task.run([
			'wp_cli:download_core',
			'wp_cli:core_config',
			'wp_cli:db_create',
			'wp_cli:install_core',
			'wp_cli:install_plugins',
			'wp_cli:remove_plugins'
		]);


		// AFTER INSTALLING
		/////////////////////

		if(!isBrandNew){
			
			// pull db
			grunt.task.run('pull_db:' + dbEnvironment);

		}

	});


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

	grunt.registerTask( 'setup', [
		'composer:update',
		'gitsubtrees',
		'bower:install',
		'wp_install',
		'symlink'
	]);

	grunt.registerTask('update', 'Update all the things.', function(){

		// update composer

		// prompt checklist of things to update

		// update WP core

		// update WP plugins

		// migrate DB down
		
	});

	grunt.registerTask('default', ['watch']); // TODO: this should be a main menu prompt


	// Load config
	var packageJSON = grunt.file.readJSON('package.json'),
		userDefaultsJSON = grunt.file.exists( userhome('.wpe_defaults') ) ? grunt.file.readJSON( userhome('.wpe_defaults') ) : {},
		siteConfigJSON = grunt.file.exists('site_config.json') ? grunt.file.readJSON('site_config.json') : {},
		siteConfigLocalJSON = grunt.file.exists('site_config.json.local') ? grunt.file.readJSON('site_config.json.local') : {};
	
	// wrap config objects for extending
	userDefaultsJSON = { config: userDefaultsJSON };
	siteConfigJSON = { config: siteConfigJSON };
	siteConfigLocalJSON = { config: siteConfigLocalJSON };

	// combine all config files
	gruntConfig.pkg = _.deepExtend( packageJSON, userDefaultsJSON, siteConfigJSON, siteConfigLocalJSON );

	
	// kick it off
	grunt.initConfig(gruntConfig);

	// KINDA HACKY TO PUT THIS HERE, but it has to be after external config is loaded:
	grunt.config( 'gitsubtrees', grunt.config.get('gitsubtrees') );

};