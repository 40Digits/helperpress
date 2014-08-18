module.exports = {
	sass_dev: {
		files: '<%= helperpress.assets_dir %>/_src/**/*.{scss,sass,css}',
		tasks: [
			'sass:dev',
			'autoprefixer:sass'
			],
		options: {
			livereload: true
		}
	},

	imagemin: {
		files: [
			'<%= helperpress.assets_dir %>/_src/**/*.{png,gif,jpg,jpeg}'
		],
		tasks: ['newer:imagemin:assets_dev'],
		options: {
			livereload: true
		}
	},

	files_reload: {
		files: [
			'./wp-theme/**/*.{ejs,html,php}'
		],
		options: {
			livereload: true
		}
	},

	browserify: {
		files: '<%= helperpress.assets_dir %>/_src/**/*.js',
		tasks: [
			'browserifyBower:libs:nowrite',
			'browserify:app'
		],
		options: {
			livereload: true
		}
	},

	browserifyBower: {
		files: './bower.json',
		tasks: [
			'browserifyBower',
			'concat:browserify'
		],
		options: {
			livereload: true
		}
	}
};