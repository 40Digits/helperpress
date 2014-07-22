module.exports = function (grunt) {

	var gruntConfig = {},

		_ = require('underscore'),
		subtrees = require('./grunt/subtrees.js');

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
	// TODO: git subtrees
	//			- sass boilerplate

	// PHP Composer
	grunt.loadNpmTasks('grunt-composer');

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



	grunt.registerTask('setup', 'Setup and configure all the things.', function(){
		// prompt for WP project info, write to package.json

		// install composer packages
		grunt.task.run('composer:update');
		grunt.task.run('composer:install');

		// install git subtrees
		subtrees.install( grunt.config.process('<%= pkg.config.subtrees %>') );
		
		// change theme dir name

		// update style.css output for WP theme config

		// install WP core
		// install WP plugins

		// symlink theme

		// create local DB
		// migrate DB

		// make wp-config.php

		// setup localhost - https://www.npmjs.org/package/grunt-localhosts - maybe extend package.json with a package.local for local URL?
	});

	grunt.registerTask('update', 'Update all the things.', function(){
		// prompt checklist of things to update

		// update WP core
		// update WP plugins
		// migrate DB

		// update git subtrees

		// update composer
	});

	grunt.registerTask('wpe_deploy', 'Deploy to WPE', function(){
		// build

		// test

		// sftp changed files between currently deployed commit and the new ones
	});

	grunt.registerTask('default', ['watch']); // TODO: this should be a main menu prompt


	// Load config
	var packageJSON = grunt.file.readJSON('package.json'),
		localPackageJSON = grunt.file.exists('package.json.local') ? grunt.file.readJSON('package.json.local') : {};

	gruntConfig.pkg = _.extend(packageJSON, localPackageJSON);
	grunt.initConfig(gruntConfig);

};