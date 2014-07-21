module.exports = function (grunt) {


	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-combine-media-queries');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-githooks');

	grunt.registerTask('default',['watch']);

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		// Start watching SASS
		sass: {
			dev: {
				options: {
					style: 'expanded',
					lineNumbers: true,
					sourcemap: false,
					compass: false
				},
				files: [{
					expand: true,
					cwd: '<%= pkg.config.sass_dir %>',
					src: ['*.{scss,sass}'],
					dest: '<%= pkg.config.sass_dir %>/',
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
					dest: '<%= pkg.config.sass_dir %>/css/',
					ext: '.css'
				}]
			}
		},

		// Add in prefixes where necessary
		autoprefixer: {
			options: {
				browsers: ['last 2 version', 'ie 9']
			},
			// prefix all files
			multiple_files: {
				expand: true,
				flatten: true,
				src: '<%= pkg.config.assets %>/css-source/raw/*.css',
				dest: '<%= pkg.config.assets %>/css-source/prefix/'
			},
		},

		// Combine Media Queries
		cmq: {
			your_target: {
				files: {
					'<%= pkg.config.sass_dir %>/': ['<%= pkg.config.assets %>/css-source/prefix/*.css']
				}
			}
		},



		//JS
		githooks: {
			all: {
				'pre-commit': 'watch'
			}
		}

		jshint: {
			all: ['gruntfile.js', '<%= pkg.config.assets %>/scripts/app/script.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		uglify: {
			my_target: {
				files: {
					'<%= pkg.config.assets %>/scripts/app/script.min.js': ['<%= pkg.config.assets %>/scripts/app/script.js']
				}
			}
		},
		watch: {
			sass: {
				files: '**/*.{scss,sass}',
				tasks: ['sass:dev'],
				options: {
					livereload: true,
				}
			}
		}
	});

	grunt.registerTask('default',['watch']);

};